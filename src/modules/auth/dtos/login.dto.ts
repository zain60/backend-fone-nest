import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LoginDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;;
    @IsString()
    password: string;
}