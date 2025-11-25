import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { AppointmentResponseDto } from "src/domain/calender-aggregate/dtos/appointment-response.dto";
import { CreateAppointmentDto } from "src/domain/calender-aggregate/dtos/create-appointment.dto";
import { UpdateAppointmentDto } from "src/domain/calender-aggregate/dtos/update-appointment.dto";
import { AppointmentService } from "src/domain/calender-aggregate/services/appointment.service";


@Controller("appointments")
export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) {}

    @Get()
    async getAllAppointments(): Promise<AppointmentResponseDto[]> {
        return await this.appointmentService.showAllAppointments();
    }

    @Get(":appointmentId")
    async getAppointmentById(@Param("appointmentId") appointmentId: string): Promise<AppointmentResponseDto> {
        return await this.appointmentService.showAppointmentById(appointmentId);
    }

    @Get("patient/:patientId")
    async getAppointmentsByPatientId(@Param("patientId") patientId: number): Promise<AppointmentResponseDto[]> {
        return await this.appointmentService.showAppointmentsByPatientId(+patientId);
    }

    @Post()
    @UsePipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }))
    async postAppointment(@Body() input: CreateAppointmentDto): Promise<AppointmentResponseDto> {
        return await this.appointmentService.addAppointment(input);
    }

    @Patch(":appointmentId")
    @UsePipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }))
    async patchAppointment(
        @Param("appointmentId") appointmentId: string,
        @Body() input: UpdateAppointmentDto
    ): Promise<AppointmentResponseDto> {
        return await this.appointmentService.updateAppointment(appointmentId, input);
    }

    @Delete(":appointmentId")
    async deleteAppointment(@Param("appointmentId") appointmentId: string): Promise<AppointmentResponseDto> {
        return await this.appointmentService.removeAppointment(appointmentId);
    }
}