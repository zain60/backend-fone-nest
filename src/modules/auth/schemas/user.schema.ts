import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User {

    @Prop({required: true})
    name: string;
    @Prop({required: true, unique: true})
    email: string;
    @Prop({required: true,unique: true})
    phoneNumber: string;
    @Prop({required: true})
    password: string;
    @Prop({required: true})
    confirmPassword: string;


  @Prop({ type: Types.ObjectId, ref: 'Tenant', required: true })
  tenantId: Types.ObjectId;
 

}
export type UsersDocument = User & Document;
export const UsersSchema = SchemaFactory.createForClass(User);
