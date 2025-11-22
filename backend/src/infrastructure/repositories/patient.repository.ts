import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { DataBaseService } from "../services/database.service.js";
import { Appointment, Patient, Post } from "generated/prisma/browser.js";
import { PatientCreateInput, PatientUpdateInput } from "generated/prisma/models.js";
import { UpdatePatientDto } from "src/domain/patient-aggregate/dtos/update-patient.dto.js";


@Injectable()
export class PatientRepository {
    constructor(private readonly databaseService: DataBaseService) {}

    async fetchPatientById(id: number): Promise<Patient & { appointments: Appointment[] } & { posts: Post[] } | null> {
        const patient = await this.databaseService.patient.findUnique({
            where: { patientId: id, deletedAt: null },
            include: { posts: true, appointments: true },
        });

        if(patient === undefined) throw new InternalServerErrorException("Server Error: could not fetch patient by Id");
        return patient;
    }

    async fetchPatientByEmail(email: string): Promise<Patient & { appointments: Appointment[] } & { posts: Post[] } | null> {
        const patient = await this.databaseService.patient.findUnique({
            where: { email, deletedAt: null },
            include: { posts: true, appointments: true }
        });

        if(patient === undefined) throw new InternalServerErrorException("Server Error: could not fetch patient by email.");
        return patient;
    }

    async fetchPatientByCpf(cpf: string): Promise<Patient & { appointments: Appointment[] } & { posts: Post[] } | null> {
        const patient = await this.databaseService.patient.findUnique({
            where: { cpf, deletedAt: null },
            include: { posts: true, appointments: true }
        });

        if(patient === undefined) throw new InternalServerErrorException("Server Error: could not fetch patient by CPF.");
        return patient;
    }

    async fetchAllPatients(): Promise<Patient[] | null> {
        const patients = await this.databaseService.patient.findMany({
            where: { deletedAt: null },
        });
        
        if(patients === undefined) throw new InternalServerErrorException("Server Error: could not fetch patients.");
        return patients;
    }

    async fetchDeletedPatients(): Promise<Patient[] | null> {
        const patients = await this.databaseService.patient.findMany({
            where: { deletedAt: { not: null } },
        });

        if(patients === undefined) throw new InternalServerErrorException("Server Error: could not fetch deleted patients.");
        return patients;
    }

    async createPatient(input: PatientCreateInput): Promise<Patient & { appointments: Appointment[] } & { posts: Post[] } | null> {
        const patient = await this.databaseService.patient.create({
            data: input,
            include: { posts: true, appointments: true },
        });

        if(!patient) throw new InternalServerErrorException("Server Error: could not create patient.");
        return patient;
    }

    async updatePatient(id: number, input: PatientUpdateInput): Promise<Patient | null> {
        const patient = await this.databaseService.patient.update({
            where: { patientId: id },
            data: input,
            include: { posts: true, appointments: true },
        });

        if(patient === undefined) throw new InternalServerErrorException("Server Error: could not update patient.");
        return patient;
    }

    deletePatient(id: number): Promise<Patient | null> {
        const patient = this.databaseService.patient.update({
            where: { patientId: id },
            data: { deletedAt: new Date() },
            include: { posts: true, appointments: true },
        });

        if(patient === undefined) throw new InternalServerErrorException("Server Error: could not delete patient.");
        return patient;
    }

    restorePatient(id: number): Promise<Patient | null> {
        const patient = this.databaseService.patient.update({
            where: { patientId: id },
            data: { deletedAt: null },
            include: { posts: true, appointments: true },
        });
        
        if(patient === undefined) throw new InternalServerErrorException("Server Error: could not reactivate patient.");
        return patient;
    }
}