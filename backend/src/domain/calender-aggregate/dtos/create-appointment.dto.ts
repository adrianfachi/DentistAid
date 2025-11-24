import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateAppointmentDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsNotEmpty()
    @IsDate()
    date: Date;

    @IsNotEmpty()
    @IsDate()
    startsAt: Date;

    @IsNotEmpty()
    @IsDate()
    endsAt: Date;

    @IsNotEmpty()
    @IsNumber()
    patientId: number;
}