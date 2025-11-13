import { Controller, Get, Param, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreatePatientDto } from "src/domain/patient-aggregate/dtos/create-patient.dto";
import { PatientResponseDto } from "src/domain/patient-aggregate/dtos/patient-response.dto";
import { PatientService } from "src/domain/patient-aggregate/services/patient.service";


@Controller("patients")
export class PatientController {
    constructor(private readonly patientService: PatientService) {}

    @Get()
    async getPatients(): Promise<any> {
        return await this.patientService.showAllPatients();
    }

    @Get(":id")
    async getPatientById(@Param("id") id: number): Promise<any> {
        return await this.patientService.showPatientById(+id);
    }

    @Get(":email")
    async getPatienByEmail(@Param("email") email: string): Promise<any> {
        return await this.patientService.showPatientByEmail(email);
    }

    @Get(":cpf")
    async getPatienByCpf(@Param("cpf") email: string): Promise<any> {
        return await this.patientService.showPatientByEmail(email);
    }

    @Post()
    @UsePipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }))
    async postPatient(input: CreatePatientDto): Promise<PatientResponseDto> {
        const patient = await this.patientService.addPatient(input);
        return patient;
    }
}