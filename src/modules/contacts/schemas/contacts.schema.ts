
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

  @Prop({ required: true })
  listId: string;

  @Prop({ required: true })
  tenantId: string;
}

export const ContactSchema = SchemaFactory.createForClass(Contact);
