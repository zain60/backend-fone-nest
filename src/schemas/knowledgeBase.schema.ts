
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type KnowledgeBaseDocument = KnowledgeBase & Document;

@Schema({ timestamps: true })
export class KnowledgeBase {
    
  @Prop({ required: false })
  inboundMessage: string;
  @Prop({ required: false })
  outboundMessage: string;

  @Prop({ required: false })
  inboundSummary: string;

  @Prop({ required: false })
  outboundSummary: string;

  @Prop({ required: false })
  tenantId: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export const KnowledgeBaseSchema = SchemaFactory.createForClass(KnowledgeBase);
