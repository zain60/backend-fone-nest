
import { IsString, IsNumber } from 'class-validator';

export class UserAppointmentSettingsDto {

    @IsString()
    userId?: string;

    @IsString()
    // @IsOptional()
    timezone?: string;

    @IsString()
    // @IsOptional()
    activeEventId?: string;

    @IsString()
    // @IsOptional()
    activeEventSlug?: string;

    @IsNumber()
    // @IsOptional()
    duration?: number;

    @IsString()
    // @IsOptional()
    apiKey?: string;
}
