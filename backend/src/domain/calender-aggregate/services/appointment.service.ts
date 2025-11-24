import { Injectable } from "@nestjs/common";
import { AppointmentRepository } from "src/infrastructure/repositories/appointment.repository";


@Injectable()
export class AppointmentService {
    constructor(private readonly appointmentRepository: AppointmentRepository) {}

    
}