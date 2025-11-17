import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { PatientRepository } from "../../../infrastructure/repositories/patient.repository";
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

    async addPatient(input: CreatePatientDto): Promise<PatientResponseDto> {
        const dto = this.patientMapper.mapCreatePatientToPrisma(input);
        const patient = await this.patientRepository.createPatient(dto);

        if(!patient) throw new InternalServerErrorException("Error: unkown error in creating patient.")
        const patientRes = this.patientMapper.mapPrismaToPatientResponse(patient);
        return patientRes;
    }    
}