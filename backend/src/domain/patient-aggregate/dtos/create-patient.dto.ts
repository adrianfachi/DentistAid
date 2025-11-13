import { Type } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";


export class CreatePatientDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    cpf: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsPhoneNumber('BR')
    telephone: string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    birthDate: Date;

    @IsNotEmpty()
    @IsString()
    occupation: string;

    @IsNotEmpty()
    @IsString()
    origin: string;

    @IsOptional()
    @IsDate()
    firstAppointment: Date;

    @IsNotEmpty()
    @IsString()
    @IsEnum(["Monthly","Bimonthly","Quarterly","Semiannual","Annual"])
    recurrence: string;
}
