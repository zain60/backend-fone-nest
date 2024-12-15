import {IsEmail, IsNotEmpty, IsPhoneNumber, IsString} from "class-validator";

export class AppointmentDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    date:Date
                    
    @IsNotEmpty()
    @IsString()
    userId: string;
                    
    @IsNotEmpty()
    @IsString()
    bookingId: string;

    @IsNotEmpty()
    @IsString()
    booking_uid: string;
                    
    @IsNotEmpty()
    @IsString()
    start_time: string;

    @IsNotEmpty()
    @IsString()
    end_time: string;
                    
    @IsNotEmpty()
    @IsString()
    status: string;

    @IsNotEmpty()
    @IsString()
    duration: number;
    

    @IsNotEmpty()
    @IsString()
    meeting_url: string;
    

    @IsNotEmpty()
    @IsString()
    attendee_name: string;
    
    @IsNotEmpty()
    @IsEmail()
    atendee_email: string;
    
    @IsNotEmpty()
    @IsString()
    active_event_id: string;
    
    @IsNotEmpty()
    @IsPhoneNumber()
    caller_phoneNumber: string;
    
    @IsNotEmpty()
    @IsPhoneNumber()
    receiver_phoneNumber: string;
    
    @IsNotEmpty()
    @IsString()
    call_id: string;
    
    @IsNotEmpty()
    @IsString()
    call_type: string;

}