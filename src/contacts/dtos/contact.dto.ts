
import { IsString, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';

export class ContactDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;




  @IsString()
  number: string;

  @IsString()
  @IsOptional()
  list: string;

}
