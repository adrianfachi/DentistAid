import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentRepository } from 'src/infrastructure/repositories/appointment.repository';
import { AppointmentResponseDto } from '../dtos/appointment-response.dto';
import { AppointmentMapper } from '../mappers/appointment.mapper';
import { PatientRepository } from 'src/infrastructure/repositories/patient.repository';
import { CreateAppointmentDto } from '../dtos/create-appointment.dto';
import { UpdateAppointmentDto } from '../dtos/update-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly appointmentMapper: AppointmentMapper,
    private readonly patientRepository: PatientRepository,
  ) {}

  async showAllAppointments(): Promise<AppointmentResponseDto[]> {
    const appointments =
      await this.appointmentRepository.fetchAllAppointments();

    if (!appointments)
      throw new NotFoundException('Error: no appointments found.');
    return appointments.map((a) =>
      this.appointmentMapper.mapPrismaToAppointmentResponse(a),
    );
  }

  async showAppointmentById(
    appointmentId: string,
  ): Promise<AppointmentResponseDto> {
    const a =
      await this.appointmentRepository.fetchAppointmentById(appointmentId);

    if (!a) throw new NotFoundException('Error: appointment not found by id.');
    return this.appointmentMapper.mapPrismaToAppointmentResponse(a);
  }

  async showAppointmentsByPatientId(patientId: number) {
    const patient = await this.patientRepository.fetchPatientById(patientId);

    if (!patient)
      throw new NotFoundException('Error: patient not found by id.');
    const appointments =
      await this.appointmentRepository.fetchAppointmentsByPatientId(patientId);

    if (!appointments)
      throw new NotFoundException(
        'Error: no appointments found for patient id.',
      );
    return appointments.map((a) =>
      this.appointmentMapper.mapPrismaToAppointmentResponse(a),
    );
  }

  async addAppointment(
    input: CreateAppointmentDto,
  ): Promise<AppointmentResponseDto> {
    const startsAt = new Date(input.startsAt);
    const endsAt = new Date(input.endsAt);

    if (await this.validateSchedule(startsAt, endsAt)) {
      const dto = this.appointmentMapper.mapCreateAppointmentToPrisma(input);
      const appointment =
        await this.appointmentRepository.createAppointment(dto);

      if (!appointment)
        throw new NotFoundException(
          'Error: Unkwown error creating appointment.',
        );
      return this.appointmentMapper.mapPrismaToAppointmentResponse(appointment);
    } else {
      throw new BadRequestException(
        'Error: appointment already scheduled at this time.',
      );
    }
  }

  async updateAppointment(
    appointmentId: string,
    input: UpdateAppointmentDto,
  ): Promise<AppointmentResponseDto> {
    const current =
      await this.appointmentRepository.fetchAppointmentById(appointmentId);
    if (!current)
      throw new NotFoundException('Error: unable to find appointment by id.');

    const starts = input.startsAt ? new Date(input.startsAt) : current.startsAt;
    const ends = input.endsAt ? new Date(input.endsAt) : current.endsAt;

    if (await this.validateSchedule(starts, ends, appointmentId)) {
      const dto = this.appointmentMapper.mapUpdateAppointmentToPrisma(input);
      const appointment = await this.appointmentRepository.updateAppointment(
        appointmentId,
        dto,
      );

      if (!appointment)
        throw new NotFoundException(
          'Error: Unkwown error updating appointment.',
        );
      return this.appointmentMapper.mapPrismaToAppointmentResponse(appointment);
    } else {
      throw new BadRequestException(
        'Error: appointment already scheduled at this time.',
      );
    }
  }

  async removeAppointment(
    appointmentId: string,
  ): Promise<AppointmentResponseDto> {
    const a = this.appointmentRepository.fetchAppointmentById(appointmentId);

    if (!a)
      throw new NotFoundException(
        'Error: appointment does not exist or has already been cancelled.',
      );
    const appointment =
      await this.appointmentRepository.deleteAppointment(appointmentId);

    if (!appointment)
      throw new NotFoundException(
        'Error: could not find appointment to cancel.',
      );
    return this.appointmentMapper.mapPrismaToAppointmentResponse(appointment);
  }

  async validateSchedule(
    newStartsAt: Date,
    newEndsAt: Date,
    id?: string,
  ): Promise<boolean> {
    if (newStartsAt >= newEndsAt) {
      throw new BadRequestException(
        'Error: Appointment start time must be before end time.',
      );
    }

    const normalizedDate = new Date(newStartsAt);
    normalizedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (normalizedDate < today) {
      throw new BadRequestException(
        'Error: Appointment date must be today or in the future.',
      );
    }
    const schedule =
      await this.appointmentRepository.fetchAllAppointmentsOnDate(
        normalizedDate,
      );

    if (!schedule || schedule.length === 0) return true;

    for (const a of schedule) {
      if (id && id === a.appointmentId) continue;

      const overlaps = newStartsAt < a.endsAt && newEndsAt > a.startsAt;

      if (overlaps) {
        return false;
      }
    }

    return true;
  }
}