import { Module } from "@nestjs/common";
import { PatientService } from "../services/patient.service";
import { PatientMapper } from "../mappers/patient.mapper";
import { PatientController } from "../../../application/controllers/patient.controller";
import { InfrastructureModule } from "../../../infrastructure/modules/infrastructure.module";

@Module({
    providers: [PatientService, PatientMapper],
    controllers: [PatientController],
    imports: [InfrastructureModule]
})
export class PatientModule {}