
import { IsString, IsEnum, IsArray, IsOptional, IsMongoId, IsDateString } from 'class-validator';

export class CreateCampaignDto {
    @IsMongoId()
    userId: string;

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
    
    @IsArray()
    @IsOptional()
    @IsMongoId({ each: true })
    completedContacts: string[];

}
