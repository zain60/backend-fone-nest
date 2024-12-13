
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  tenantId: string;

  @Prop({ required: false })
  apiKey: string;

  @Prop({ required: false })
  duration: number;

  @Prop({ required: false })
  activeEventSlug: string;

  @Prop({ required: false })
  activeEventId: string;

  @Prop({ required: false })
  timezone: string;

  @Prop({ required: false, type: SchemaTypes.ObjectId })
  roleId?: Types.ObjectId;


}

export const UserSchema = SchemaFactory.createForClass(User);
