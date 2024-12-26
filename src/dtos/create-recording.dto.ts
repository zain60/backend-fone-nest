import { IsString, IsNotEmpty, IsUrl, IsNumber, IsPhoneNumber } from "class-validator";

export class CreateRecordingDto {
    @IsString()
        @IsNotEmpty()
        name: string;

        @IsNotEmpty()
        callerPhone: string;
    
        @IsNotEmpty()
        customerPhone: string;
    
        @IsString()
        @IsUrl()
        recordingUrl: string;
    
        @IsString()
        summary: string;
        
        @IsNotEmpty()
        @IsString()
        type: string;

        @IsNotEmpty()
        duration: number;

        @IsString()
        @IsNotEmpty()
        userId: string;
    
}
