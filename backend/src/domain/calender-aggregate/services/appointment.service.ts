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
    const date = new Date(input.date);
    const starts = new Date(input.startsAt);
    const ends = new Date(input.endsAt);

    if (await this.validateSchedule(date, starts, ends)) {
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

    const date = input.date ? input.date : current.date;
    const starts = input.startsAt ? input.startsAt : current.startsAt;
    const ends = input.endsAt ? input.endsAt : current.endsAt;

    if (await this.validateSchedule(date, starts, ends, appointmentId)) {
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
    date: Date,
    startTime: Date,
    endTime: Date,
    id?: string,
  ): Promise<boolean> {
    if (startTime >= endTime)
      throw new BadRequestException(
        'Error: Appointment start time must be before end time.',
      );
    if (date < new Date())
      throw new BadRequestException(
        'Error: Appointment date must be in the future.',
      );
    const schedule =
      await this.appointmentRepository.fetchAllAppointmentsOnDate(date);

    if (!schedule)
      throw new NotFoundException(
        'Error: unkown error fetching appointments on a given date.',
      );
    if ((schedule.length = 0)) return true;
    schedule.forEach((a) => {
      const aStarts = new Date(a.startsAt);
      const aEnds = new Date(a.endsAt);
      const overlaps =
        (startTime >= aStarts && startTime < aEnds) ||
        (endTime > aStarts && endTime <= aEnds) ||
        (startTime <= aStarts && endTime >= aEnds);
      const isNotSelf = id !== a.appointmentId;

      if (overlaps && isNotSelf) return false;
    });
    return true;
  }
}
