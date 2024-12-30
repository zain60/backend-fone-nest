
import { IsString, IsEnum, IsArray, IsOptional, IsMongoId, IsDateString } from 'class-validator';

export class CreateCampaignDto {
    @IsMongoId()
    userId: string;

    @IsString()
    name: string;

    @IsEnum(['outbound', 'inbound'])
    type: string;

    @IsOptional()
    @IsEnum(['active', 'inactive', 'completed'])
    status: string;
    
    @IsOptional()
    phoneNumber: string;

    @IsOptional()
    list: string;

    @IsString()
    voiceId: string;

    @IsDateString()
    @IsOptional()
    lastCallTime: Date;
    
    @IsOptional()
    @IsString()
    completedContacts: string

}
