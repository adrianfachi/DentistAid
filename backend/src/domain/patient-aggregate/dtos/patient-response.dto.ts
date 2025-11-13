import { Appointment, Post } from "generated/prisma/client";


export class PatientResponseDto {
    patientId: string;
    email: string;
    cpf: string;
    name: string;
    telephone: string;
    birthDate: Date;
    occupation: string;
    origin: string;
    firstAppointment: Date;
    recurrence: string;
    createdAt: Date;
    updatedAt: Date;
    posts: Post[];
    appointments: Appointment[];
}