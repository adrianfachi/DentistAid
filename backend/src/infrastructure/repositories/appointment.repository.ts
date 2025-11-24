import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DataBaseService } from "../services/database.service";
import { Appointment } from "generated/prisma/client";
import { AppointmentCreateInput, AppointmentUpdateInput } from "generated/prisma/models";


@Injectable()
export class AppointmentRepository {
    constructor(private readonly databaseService: DataBaseService) {}

    fetchAllAppointments(): Promise<Appointment[] | null> {
        const appointments = this.databaseService.appointment.findMany({
            where: { cancelledAt: null },
        });

        if(appointments === undefined) throw new InternalServerErrorException("Database Error: Unable to fetch appointments.");
        return appointments;
    }

    fetchAppointmentById(appointmentId: string): Promise<Appointment | null> {
        const appointment = this.databaseService.appointment.findUnique({
            where: { appointmentId, cancelledAt: null },
        });

        if(appointment === undefined) throw new InternalServerErrorException("Database Error: Unable to fetch appointment by uuid.");
        return appointment;
    }

    fetchAppointmentsByPatientId(patientId: number): Promise<Appointment[] | null> {
        const p = this.databaseService.patient.findUnique({
            where: { patientId, deletedAt: null },
        });

        if(!p) throw new NotFoundException("Error: unable to find patient by id.");
        const appointments = this.databaseService.appointment.findMany({
            where: { patientId, cancelledAt: null },
        });

        if(appointments === undefined) throw new InternalServerErrorException("Database Error: Unable to fetch appointments by patient id.");
        return appointments;
    }

    createAppointment(data: AppointmentCreateInput): Promise<Appointment | null> {
        const appointment = this.databaseService.appointment.create({
            data: data,
        });

        if(appointment === undefined) throw new InternalServerErrorException("Database Error: Unable to create appointment.");
        return appointment;
    }

    updateAppointment(appointmentId: string, data: AppointmentUpdateInput): Promise<Appointment | null> {
        const appointment = this.databaseService.appointment.update({
            where: { appointmentId, cancelledAt: null },
            data: data,
        });

        if(appointment === undefined) throw new InternalServerErrorException("Database Error: Unable to update appointment.");
        return appointment;
    }

    deleteAppointment(appointmentId: string): Promise<Appointment | null> {
        const appointment = this.databaseService.appointment.update({
            where: { appointmentId, cancelledAt: null },
            data: { cancelledAt: new Date() },
        });

        if(appointment === undefined) throw new InternalServerErrorException("Database Error: Unable to delete appointment.");
        return appointment;
    }
}