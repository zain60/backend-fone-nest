
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class ContactDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;


  @IsString()
  number: string;

  @IsOptional()
  @IsString()
  listId: string;

  @IsString()
  userId: string;
}
