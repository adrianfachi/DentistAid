import { Injectable, NotFoundException } from "@nestjs/common";
import { PatientRepository } from "src/infrastructure/repositories/patient.repository";





@Injectable()
export class PatientService {
    constructor(private readonly patientRepository: PatientRepository) {}

    // FIXME: Add mapper and dtos

    async showAllPatients(): Promise<any> {
        const patients = await this.patientRepository.fetchAllPatients();

        if(!patients) throw new NotFoundException("Error: could not find any patients.");
        return patients;
    }

    async showPatientById(id: number): Promise<any> {
        const patient = await this.patientRepository.fetchPatientById(id);

        if(!patient) throw new NotFoundException("Error: could not find id.");
        return patient;
    }

    async showPatientByEmail(email: string): Promise<any> {
        const patient = await this.patientRepository.fetchPatientByEmail(email);

        if(!patient) throw new NotFoundException("Error: could not find email.");
        return patient;
    }

    async showPatientByCpf(cpf: string): Promise<any> {
        const patient = await this.patientRepository.fetchPatientByCpf(cpf);

        if(!patient) throw new NotFoundException("Error: could not find cpf.")
    }
}