import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PatientRepository } from "../../../infrastructure/repositories/patient.repository";
import { PatientMapper } from "../mappers/patient.mapper";
import { PatientResponseDto } from "../dtos/patient-response.dto";
import { CreatePatientDto } from "../dtos/create-patient.dto";
import { UpdatePatientDto } from "../dtos/update-patient.dto";


@Injectable()
export class PatientService {
    constructor(
        private readonly patientRepository: PatientRepository,
        private readonly patientMapper: PatientMapper,
    ) {}

    async showAllPatients(): Promise<any> {
        let patients = await this.patientRepository.fetchAllPatients();

        if(!patients) throw new NotFoundException("Error: no patients have been registered.");
        patients = patients.map(p => {
            p = this.patientMapper.mapPrismaToPatientResponse(p);
            return p;
        });
        return patients;
    }

    async showPatientById(id: number): Promise<PatientResponseDto> {
        const patient = await this.patientRepository.fetchPatientById(id);

        if(!patient) throw new NotFoundException("Error: could not find id.");
        const patientRes = this.patientMapper.mapPrismaToPatientResponse(patient);
        return patientRes;
    }

    async showPatientByEmail(email: string): Promise<PatientResponseDto> {
        const patient = await this.patientRepository.fetchPatientByEmail(email);

        if(!patient) throw new NotFoundException("Error: could not find email.");
        const patientRes = this.patientMapper.mapPrismaToPatientResponse(patient);
        return patientRes;
    }

    async showPatientByCpf(cpf: string): Promise<PatientResponseDto> {
        const patient = await this.patientRepository.fetchPatientByCpf(cpf);

        if(!patient) throw new NotFoundException("Error: could not find cpf.")
        const patientRes = this.patientMapper.mapPrismaToPatientResponse(patient);
        return patientRes;
    }

    async showDeletedPatients(): Promise<PatientResponseDto[]> {
        let patients = await this.patientRepository.fetchDeletedPatients();
        
        if(!patients) throw new NotFoundException("Error: no patients have been deleted.");
        patients = patients.map(p => {
            p = this.patientMapper.mapPrismaToPatientResponse(p);
            return p;
        });
        return patients;
    }

    async addPatient(input: CreatePatientDto): Promise<PatientResponseDto> {
        const dto = this.patientMapper.mapCreatePatientToPrisma(input);
        const patient = await this.patientRepository.createPatient(dto);

        if(!patient) throw new InternalServerErrorException("Error: unkown error in creating patient.")
        const patientRes = this.patientMapper.mapPrismaToPatientResponse(patient);
        return patientRes;
    }

    async updatePatient(id: number, input: UpdatePatientDto): Promise<PatientResponseDto> {
        const dto = this.patientMapper.mapUpdatePatientToPrisma(input);
        const patient = await this.patientRepository.updatePatient(id, dto);

        if(!patient) throw new NotFoundException("Error: could not find patient to update.");
        const patientRes = this.patientMapper.mapPrismaToPatientResponse(patient);
        return patientRes;
    }

    async removePatient(id: number): Promise<PatientResponseDto> {
        const p = await this.patientRepository.fetchPatientById(id);

        if(!p) throw new NotFoundException("Error: patient does not exist or has already been deleted.");
        let patient = await this.patientRepository.deletePatient(id);

        if(!patient) throw new NotFoundException("Error: could not find patient to delete.");
        patient = this.patientMapper.mapPrismaToPatientResponse(patient);
        return patient;
    }

    async reactivatePatient(id: number): Promise<PatientResponseDto> {
        const patients = await this.patientRepository.fetchDeletedPatients();

        if(!patients) throw new NotFoundException("Error: no patients have been deleted.");
        const p = patients.find(p => p.patientId === id);

        if(!p) throw new NotFoundException("Error: patient does not exist or is already active.");
        let patient = await this.patientRepository.restorePatient(id);

        if(!patient) throw new NotFoundException("Error: could not find patient to reactivate.");
        patient = this.patientMapper.mapPrismaToPatientResponse(patient);
        return patient;
    }
}