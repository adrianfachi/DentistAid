import { Module } from '@nestjs/common';
import { DataBaseService } from '../services/database.service';
import { PatientRepository } from '../repositories/patient.repository';


@Module({
    providers: [DataBaseService, PatientRepository],
})
export class InfrastructureModule {}