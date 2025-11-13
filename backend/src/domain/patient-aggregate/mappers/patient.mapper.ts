import { Injectable } from "@nestjs/common";
import { PatientResponseDto } from "../dtos/patient-response.dto";
import { Patient } from "generated/prisma/client";
import { CreatePatientDto } from "../dtos/create-patient.dto";
import { PatientCreateInput, PatientUpdateInput } from "generated/prisma/models";
import { UpdatePatientDto } from "../dtos/update-patient.dto";


@Injectable()
export class PatientMapper {

    mapPrismaToPatientResponse(input: Patient): PatientResponseDto {
        const patient: PatientResponseDto = {
            patientId: input.patientId,
            email: input.email,
            cpf: input.cpf,
            name: input.name,
            telephone: input.telephone,
            birthDate: input.birth_date,
            occupation: input.occupation,
            origin: input.origin,
            firstAppointment: input.first_appointment,
            recurrence: input.recurrence,
            createdAt: input.createdAt,
            updatedAt: input.updateAt,
            posts: input.posts,
            appointments: input.appointments,
        };
        return patient;
    }

    mapCreatePatientToPrisma(input: CreatePatientDto): PatientCreateInput {
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
