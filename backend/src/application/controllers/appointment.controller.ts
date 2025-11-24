import { Controller } from "@nestjs/common";
import { AppointmentService } from "src/domain/calender-aggregate/services/appointment.service";


@Controller("appointments")
export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) {}


}