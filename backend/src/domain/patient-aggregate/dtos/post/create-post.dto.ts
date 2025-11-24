import { IsArray, IsBase64, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";


export class CreatePostDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(300)
    content: string;

    @IsOptional()
    @IsArray()
    @IsBase64({}, { each: true })
    image: string[];
}