export class AppointmentResponseDto {
    appointmentId: string;
    name: string;
    date: Date;
    startsAt: Date;
    endsAt: Date;
    cancelledAt?: Date;
    patientId: number;
}