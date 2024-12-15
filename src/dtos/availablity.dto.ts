import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class AvailabilityDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsDateString()  // Validates the date string in ISO 8601 format
  @IsNotEmpty()
  startDate: string;

  @IsDateString()  // Validates the date string in ISO 8601 format
  @IsNotEmpty()
  endDate: string;
}
