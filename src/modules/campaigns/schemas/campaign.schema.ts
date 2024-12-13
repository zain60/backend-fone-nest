
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

    @Prop({ required: true })
    phoneNumber: string;

    @Prop({ type: [String], default: [] })
    list: string[];

    @Prop()
    voiceId: string;

    @Prop({ type: Date })
    lastCallTime: Date;

    completedContacts: number;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);
