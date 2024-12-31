
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type KnowledgeBaseDocument = KnowledgeBase & Document;

@Schema({ timestamps: true })
export class KnowledgeBase {
    

  @Prop({ required: false,enum: ['inbound', 'outbound'] })
  type: string;

  @Prop({ required: false })
  fisrt_message: string;

  @Prop({ required: false })
  content: string;

  @Prop({ required: false })
  voice_id: string;

  @Prop({ required: false })
  assitant_id: string;
 
  @Prop({ type: Types.ObjectId, ref: 'TwilioNumber', required: false })
  caller_id:Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export const KnowledgeBaseSchema = SchemaFactory.createForClass(KnowledgeBase);
