import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Appointment extends Document {
  @Prop({ required: true })
  title: string;
  
  @Prop({required:true})
  date:Date

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({required:true})
  bookingId:string;

  @Prop({required:true})
  booking_uid:string

  @Prop({required:true})
  start_time:string

  @Prop({required:true})
  end_time:string

  @Prop({required:true})
  status:string

  @Prop({required:true})
  duration:number

  @Prop({required:true})
  meeting_url:string

  @Prop({required:true})
  attendee_name:string

  @Prop({required:true})
  atendee_email:string

  @Prop({required:true})
  active_event_id:string

  @Prop({required:true})
  caller_phoneNumber:string

  @Prop({required:true})
  receiver_phoneNumber:string

  @Prop({required:true})
  call_id:string
  
  @Prop({required:true})
  call_type:string

  @Prop({ required: true })
  tenantId: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
