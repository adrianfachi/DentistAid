import { Module } from '@nestjs/common';
import { DataBaseService } from '../services/database.service.js';
import { PatientRepository } from '../repositories/patient.repository.js';


@Module({
    providers: [DataBaseService, PatientRepository],
    exports: [PatientRepository]
})
export class InfrastructureModule {}