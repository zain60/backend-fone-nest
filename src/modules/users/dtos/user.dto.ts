
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
