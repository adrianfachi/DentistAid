import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { CreatePatientDto } from "../../domain/patient-aggregate/dtos/create-patient.dto";
import { PatientResponseDto } from "../../domain/patient-aggregate/dtos/patient-response.dto";
import { PatientService } from "../../domain/patient-aggregate/services/patient.service";
import { UpdatePatientDto } from "src/domain/patient-aggregate/dtos/update-patient.dto";


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

    @Get("email/:email")
    async getPatienByEmail(@Param("email") email: string): Promise<any> {
        return await this.patientService.showPatientByEmail(email);
    }

    @Get("cpf/:cpf")
    async getPatienByCpf(@Param("cpf") email: string): Promise<any> {
        return await this.patientService.showPatientByEmail(email);
    }

    @Get("deleted")
    async getDeletedPatients(): Promise<PatientResponseDto[]> {
        return await this.patientService.showDeletedPatients();
    }

    @Post()
    @UsePipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }))
    async postPatient(@Body() input: CreatePatientDto): Promise<PatientResponseDto> {
        return await this.patientService.addPatient(input);
    }

    @Patch(":id")
    @UsePipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }))
    async patchUser(
        @Param(":id") id: number,
        @Body() input: UpdatePatientDto
    ): Promise<PatientResponseDto> {
        return await this.patientService.updatePatient(id, input);
    }

    @Delete(":id")
    async deleteUser(@Param("id") id: number): Promise<PatientResponseDto> {
        return await this.patientService.removePatient(id);
    }

    @Delete("restore/:id")
    async restoreUser(@Param("id") id: number): Promise<PatientResponseDto> {
        return await this.patientService.reactivatePatient(id);
    }
}