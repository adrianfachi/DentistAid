import { Module } from '@nestjs/common';
import { DataBaseService } from '../services/database.service';
import { PatientRepository } from '../repositories/patient.repository';


@Module({
    providers: [DataBaseService, PatientRepository],
    exports: [PatientRepository]
})
export class InfrastructureModule {}