
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TwilioNumberDocument = TwilioNumber & Document;

@Schema({ timestamps: true })
export class TwilioNumber {
  @Prop({ required: true })
  number: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
   
  @Prop({ required: true })
  tenantId: string;

  // twilio id
  @Prop({ required: true })
  sid: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  vopi_number_id:string;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const TwilioNumberSchema = SchemaFactory.createForClass(TwilioNumber);
