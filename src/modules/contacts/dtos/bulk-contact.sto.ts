import { IsArray, IsString } from 'class-validator';
import { ContactDto } from './contact.dto';

export class BulkContactDto {
  @IsArray()
  contacts: ContactDto[];

  @IsString()
  userId: string;
}