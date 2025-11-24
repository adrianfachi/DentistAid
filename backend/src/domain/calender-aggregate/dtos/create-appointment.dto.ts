import { Type } from "class-transformer";
import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateAppointmentDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsNotEmpty()
    @IsDateString()
    @Type(() => Date)
    date: Date;

    @IsNotEmpty()
    @IsDateString()
    @Type(() => Date)
    startsAt: Date;

    @IsNotEmpty()
    @IsDateString()
    @Type(() => Date)
    endsAt: Date;

    @IsNotEmpty()
    @IsNumber()
    patientId: number;
}