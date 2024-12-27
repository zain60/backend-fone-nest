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

    @IsString()
    @IsNotEmpty()
    status: string;

    @IsString()
    @IsNotEmpty()
    vopi_number_id:string

    isDeleted: boolean;
}

