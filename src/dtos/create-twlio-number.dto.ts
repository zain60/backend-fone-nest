import { IsString, IsNotEmpty } from "class-validator";

export class CreateTwlioNumberDto {
    @IsString()
    @IsNotEmpty()
    number: string;

    @IsString()
    @IsNotEmpty()
    sid: string;

    @IsString()
    @IsNotEmpty()
    userId: string
}
