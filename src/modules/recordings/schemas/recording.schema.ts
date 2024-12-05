import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Recording extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  recordingUrl: string;

  @Prop()
  callerPhone: number;

  @Prop()
  customerPhone: number;

  @Prop()
  summery: string;

  @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({ required: true })
  tenantId: string;

  @Prop({ default: false })
  isArchived: boolean;

  @Prop({ type: String, enum: ['outbound', 'inbound'], required: true })
  type: string;

}

export const RecordingSchema = SchemaFactory.createForClass(Recording);
