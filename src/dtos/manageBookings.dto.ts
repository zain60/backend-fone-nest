import { IsNotEmpty, IsString } from "class-validator";

export class ManageBookingsDto {

    @IsString()
    @IsNotEmpty()
    action: string;

    @IsString()
    @IsNotEmpty()
    booking_uid: string;

    @IsString()
    @IsNotEmpty()
    newDateTime: string;

    @IsString()
    @IsNotEmpty()
    userId: string;

}