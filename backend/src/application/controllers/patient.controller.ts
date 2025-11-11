import { Controller, Get, Param } from "@nestjs/common";
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
}