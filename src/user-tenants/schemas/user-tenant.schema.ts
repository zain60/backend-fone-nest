import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class UserTenant extends Document {
  @Prop({ required: true })
  userName: string;
  @Prop({ required: true, unique: true })
  tenantId: string;
}

export type TenantDocument = UserTenant & Document;
export const UserTenantSchema = SchemaFactory.createForClass(UserTenant);