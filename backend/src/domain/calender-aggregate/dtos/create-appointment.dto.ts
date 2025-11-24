import { Type } from "class-transformer";
import { IsDate, IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateAppointmentDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    date: Date;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    startsAt: Date;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    endsAt: Date;

    @IsNotEmpty()
    @IsNumber()
    patientId: number;
}