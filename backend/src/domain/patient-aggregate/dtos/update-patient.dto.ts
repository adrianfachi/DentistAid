import { Type } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length } from "class-validator";


export class UpdatePatientDto {
    @IsOptional()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    cpf: string;

    @IsOptional()
    @IsString()
    @Length(3, 60)
    name: string;

    @IsOptional()
    @IsPhoneNumber('BR')
    telephone: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    birthDate: Date;

    @IsOptional()
    @IsString()
    occupation: string;

    @IsOptional()
    @IsString()
    origin: string;

    @IsOptional()
    @IsDate()
    firstAppointment: Date;

    @IsOptional()
    @IsString()
    @IsEnum(["Monthly","Bimonthly","Quarterly","Semiannual","Annual"])
    recurrence: string;
}
