
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ContactDocument = Contact & Document;

@Schema({ timestamps: true })
export class Contact {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  number: string;

  @Prop({ type: Types.ObjectId, ref: 'List', required: true })
  listId: Types.ObjectId;

  @Prop({ required: true })
  tenantId: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
