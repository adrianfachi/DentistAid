import { Appointment } from "../../calender-aggregate/entities/appointment.entity";
import { Post } from "../entities/post.entity";



export class PatientResponseDto {
    patientId: number;
    email: string;
    cpf: string;
    name: string;
    telephone: string;
    birth_date: Date;
    occupation: string;
    origin: string;
    first_appointment: Date | null;
    recurrence: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    posts?: Post[];
    appointments?: Appointment[];
}