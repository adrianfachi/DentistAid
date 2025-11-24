import { Injectable } from "@nestjs/common";
import { Appointment } from "generated/prisma/browser";
import { AppointmentResponseDto } from "../dtos/appointment-response.dto";
import { CreateAppointmentDto } from "../dtos/create-appointment.dto";
import { AppointmentCreateInput, AppointmentUpdateInput } from "generated/prisma/models";
import { UpdateAppointmentDto } from "../dtos/update-appointment.dto";


@Injectable()
export class AppointmentMapper {

    mapPrismaToAppointmentResponse(prisma: Appointment): AppointmentResponseDto {
        return {
            appointmentId: prisma.appointmentId,
            patientId: prisma.patientId,
            name: prisma.name,
            date: prisma.date,
            startsAt: prisma.startsAt,
            endsAt: prisma.endsAt,
            cancelledAt: prisma.cancelledAt,
        };
    }

    mapCreateAppointmentToPrisma(dto: CreateAppointmentDto): AppointmentCreateInput {
        return {
            name: dto.name,
            date: dto.date,
            startsAt: dto.startsAt,
            endsAt: dto.endsAt,
            patient: {
                connect: { patientId: dto.patientId }
            }
        }
    }

    mapUpdateAppointmentToPrisma(dto: UpdateAppointmentDto): AppointmentUpdateInput {
        return {
            name: dto.name,
            date: dto.date,
            startsAt: dto.startsAt,
            endsAt: dto.endsAt,
            patient: {
                connect: { patientId: dto.patientId }
            }
        }
    }
}