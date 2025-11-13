import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PatientRepository } from "src/infrastructure/repositories/patient.repository";
import { PatientMapper } from "../mappers/patient.mapper";
import { PatientResponseDto } from "../dtos/patient-response.dto";
import { CreatePatientDto } from "../dtos/create-patient.dto";


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
        });
        return patients;
    }

    async showPatientById(id: number): Promise<PatientResponseDto> {
        let patient = await this.patientRepository.fetchPatientById(id);

        if(!patient) throw new NotFoundException("Error: could not find id.");
        patient = this.patientMapper.mapPrismaToPatientResponse(patient);
        return patient;
    }

    async showPatientByEmail(email: string): Promise<PatientResponseDto> {
        let patient = await this.patientRepository.fetchPatientByEmail(email);

        if(!patient) throw new NotFoundException("Error: could not find email.");
        patient = this.patientMapper.mapPrismaToPatientResponse(patient);
        return patient;
    }

    async showPatientByCpf(cpf: string): Promise<PatientResponseDto> {
        let patient = await this.patientRepository.fetchPatientByCpf(cpf);

        if(!patient) throw new NotFoundException("Error: could not find cpf.")
        patient = this.patientMapper.mapPrismaToPatientResponse(patient);
        return patient;
    }

    async addPatient(input: CreatePatientDto): Promise<PatientResponseDto> {
        const dto = this.patientMapper.mapCreatePatientToPrisma(input);
        let patient = await this.patientRepository.createPatient(dto);

        if(!patient) throw new InternalServerErrorException("Error: unkown error in creating patient.")
        patient = this.patientMapper.mapPrismaToPatientResponse(patient);
        return patient;
    }    
}