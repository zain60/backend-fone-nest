
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsOptional()
  role: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
