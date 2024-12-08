import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Recording extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  recordingUrl: string;

  @Prop()
  callerPhone: string;

  @Prop()
  customerPhone: string;

  @Prop()
  summery: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  tenantId: string;

  @Prop({ type: String, enum: ['outbound', 'inbound'], required: true })
  type: string;

}

export const RecordingSchema = SchemaFactory.createForClass(Recording);
