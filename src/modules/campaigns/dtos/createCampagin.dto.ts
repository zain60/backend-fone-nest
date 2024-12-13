
import { IsString, IsEnum, IsArray, IsOptional, IsMongoId, IsDateString, IsNumber } from 'class-validator';

export class CreateCampaignDto {
    @IsMongoId()
    user: string;

    @IsString()
    name: string;

    @IsEnum(['outbound', 'inbound'])
    type: string;

    @IsEnum(['active', 'inactive', 'completed'])
    status: string;

    @IsString()
    phoneNumber: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    list: string[];

    @IsString()
    @IsOptional()
    voiceId: string;

    @IsDateString()
    @IsOptional()
    lastCallTime: Date;

    @IsNumber()
    @IsOptional()
    completedContacts: number;
}
