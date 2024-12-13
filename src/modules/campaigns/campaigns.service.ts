import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Campaign } from './schemas/campaign.schema';
import { CreateCampaignDto } from './dtos/createCampagin.dto';

@Injectable()
export class CampaignsService {
    constructor(
        @Inject('CAMPAGIN_MODEL') private campaignModel: Model<Campaign>) {}

    async createCampaign(data:CreateCampaignDto): Promise<Campaign> {
        const createdCampaign = new this.campaignModel({
            name: data.name,
            type: data.type,
            status: data.status,
            phoneNumber: data.phoneNumber,
            list: data.list,
            voiceId: data.voiceId,
            lastCallTime: data.lastCallTime,
            completedContacts: data,
            user: data.userId
        });
        await createdCampaign.save();
        return createdCampaign;
    }
}
