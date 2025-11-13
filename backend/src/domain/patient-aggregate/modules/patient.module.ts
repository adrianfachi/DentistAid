import { Module } from "@nestjs/common";
import { PatientController } from "src/application/controllers/patient.controller";
import { InfrastructureModule } from "src/infrastructure/modules/infrastructure.module";
import { PatientService } from "../services/patient.service";
import { PatientMapper } from "../mappers/patient.mapper";


@Module({
    providers: [PatientService, PatientMapper],
    controllers: [PatientController],
    imports: [InfrastructureModule]
})
export class PatientModule {}