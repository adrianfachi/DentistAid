import { Module } from '@nestjs/common';
import { DataBaseService } from '../services/database.service.js';
import { PatientRepository } from '../repositories/patient.repository.js';
import { PostRepository } from '../repositories/post.respository.js';
import { AppointmentRepository } from '../repositories/appointment.repository.js';


@Module({
    providers: [DataBaseService, PatientRepository, PostRepository, AppointmentRepository],
    exports: [PatientRepository, PostRepository, AppointmentRepository]
})
export class InfrastructureModule {}