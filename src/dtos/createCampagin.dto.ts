
import { IsString, IsEnum, IsOptional, IsMongoId } from 'class-validator';

export class CreateCampaignDto {
    @IsMongoId()
    userId: string;

    @IsString()
    name: string;

    @IsEnum(['outbound', 'inbound'])
    type: string;

    @IsEnum(["immediate","scheduled","recurring"])
    sending_type:string

    @IsOptional()
    @IsEnum(['active', 'inactive', 'completed'])
    status: string;
    
    @IsOptional()
    phoneNumber: string;

    @IsOptional()
    schedule: Date;
    
    @IsOptional()
    ListName: string;

}
