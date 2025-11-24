import { Injectable } from "@nestjs/common";
import { Patient } from "generated/prisma/client.js";
import { PatientResponseDto } from "../dtos/patient/patient-response.dto.js";
import { CreatePatientDto } from "../dtos/patient/create-patient.dto.js";
import { PatientCreateInput, PatientUpdateInput } from "generated/prisma/models.js";
import { UpdatePatientDto } from "../dtos/patient/update-patient.dto.js";


@Injectable()
export class PatientMapper {

    mapPrismaToPatientResponse(input: Patient & { appointments? } & { posts? }): PatientResponseDto {
        const patient: PatientResponseDto = {
            patientId: input.patientId,
            email: input.email,
            cpf: input.cpf,
            name: input.name,
            telephone: input.telephone,
            birth_date: input.birth_date,
            occupation: input.occupation,
            origin: input.origin,
            first_appointment: input.first_appointment,
            recurrence: input.recurrence,
            createdAt: input.createdAt,
            updatedAt: input.updatedAt,
            deletedAt: input.deletedAt,
            posts: input.posts ? input.posts : [],
            appointments: input.appointments ? input.appointments : [],
        };
        return patient;
    }

    mapCreatePatientToPrisma(input: CreatePatientDto): PatientCreateInput {
        console.log(input);
        const patient: PatientCreateInput = {
            email: input.email,
            cpf: input.cpf,
            name: input.name,
            telephone: input.telephone,
            birth_date: input.birthDate,
            occupation: input.occupation,
            origin: input.origin,
            first_appointment: input.firstAppointment,
            recurrence: input.recurrence,
        };
        return patient;
    }

    mapUpdatePatientToPrisma(input: UpdatePatientDto): PatientUpdateInput {
        const patient: PatientUpdateInput = {
            email: input.email,
            cpf: input.cpf,
            name: input.name,
            telephone: input.telephone,
            birth_date: input.birthDate,
            occupation: input.occupation,
            origin: input.origin,
            first_appointment: input.firstAppointment,
            recurrence: input.recurrence,
        };
        return patient;
    }
}
