import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Campaign } from './schemas/campaign.schema';

@Injectable()
export class CampaignsService {
    constructor(
        @Inject('CAMPAGIN_MODEL') private campaignModel: Model<Campaign>) {}

    async createCampaign(): Promise<Campaign> {
        const createdCampaign = new this.campaignModel({
            name: 'New Campaign',
            description: 'This is a new campaign',
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        await createdCampaign.save();
        return createdCampaign;
    }
}
