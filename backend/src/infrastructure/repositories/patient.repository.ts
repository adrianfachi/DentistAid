import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { DataBaseService } from "../services/database.service";
import { Patient } from "generated/prisma/client";
import { PatientCreateInput } from "generated/prisma/models";


@Injectable()
export class PatientRepository {
    constructor(private readonly databaseService: DataBaseService) {}

    async fetchPatientById(id: number): Promise<Patient | null> {
        const patient = await this.databaseService.patient.findUnique({
            where: { patientId: id },
            include: { posts: true, appointments: true },
        });

        if(patient === undefined) throw new InternalServerErrorException("Server Error: could not fetch patient by Id");
        return patient;
    }

    async fetchPatientByEmail(email: string): Promise<Patient | null> {
        const patient = await this.databaseService.patient.findUnique({
            where: { email },
            include: { posts: true, appointments: true }
        });

        if(patient === undefined) throw new InternalServerErrorException("Server Error: could not fetch patient by email");
        return patient;
    }

    async fetchPatientByCpf(cpf: string): Promise<Patient | null> {
        const patient = await this.databaseService.patient.findUnique({
            where: { cpf },
            include: { posts: true, appointments: true }
        });

        if(patient === undefined) throw new InternalServerErrorException("Server Error: could not fetch patient by CPF");
        return patient;
    }

    async fetchPatients(): Promise<Patient[] | null> {
        const patients = await this.databaseService.patient.findMany({
            where: { deletedAt: null }
        });
        
        if(patients === undefined) throw new InternalServerErrorException("Server Error: could not fetch patients");
        return patients;
    }

    async createPatient(input: PatientCreateInput): Promise<Patient | null> {
        const patient = await this.databaseService.patient.create({
            data: input,
        });

        if(patient === undefined) throw new InternalServerErrorException("Server Error: could not create patient");
        return patient;
    }

    updatePatient(id: number, input: Partial<PatientCreateInput>): Promise<Patient | null> {
        const patient = this.databaseService.patient.update({
            where: { patientId: id },
            data: input,
        });

        if(patient === undefined) throw new InternalServerErrorException("Server Error: could not update patient");
        return patient;
    }

    deletePatient(id: number): Promise<Patient | null> {
        const patient = this.databaseService.patient.update({
            where: { patientId: id },
            data: { deletedAt: new Date() },
        });

        if(patient === undefined) throw new InternalServerErrorException("Server Error: could not delete patient");
        return patient;
    }
}