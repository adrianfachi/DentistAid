import { Module } from "@nestjs/common";
import { AppointmentController } from "src/application/controllers/appointment.controller";
import { AppointmentService } from "../services/appointment.service";
import { InfrastructureModule } from "src/infrastructure/modules/infrastructure.module";
import { AppointmentMapper } from "../mappers/appointment.mapper";


@Module({
    controllers: [AppointmentController],
    providers: [AppointmentService, AppointmentMapper],
    imports: [InfrastructureModule]
})
export class AppointmentModule {}