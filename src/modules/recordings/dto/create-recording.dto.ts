import { IsString, IsNotEmpty, IsUrl } from "class-validator";

export class CreateRecordingDto {
    @IsString()
        @IsNotEmpty()
        name: string;

        @IsString()
        @IsNotEmpty()
        callerPhone: string;
    
        @IsString()
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
    
}
