
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CampaignDocument = Campaign & Document;

@Schema({ timestamps: true })
export class Campaign {

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, enum: ['outbound', 'inbound'] })
    type: string;

    @Prop({ required: true, default: 'active', enum: ['active', 'inactive', 'completed'] })
    status: string;

    @Prop({ required: true, default: 'immediate', enum: ['immediate', 'scheduled', 'recurring'] })
    sending_type: string;

    @Prop({ required: true })
    phoneNumber: string;

    @Prop({ required: false })
    schedule:string

    @Prop({ type: Types.ObjectId, ref: 'List', required: false })
    list: Types.ObjectId;

    @Prop()
    voiceId: string;
    
    @Prop({required:true})
    tenandId: string;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
