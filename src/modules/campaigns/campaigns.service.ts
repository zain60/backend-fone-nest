import { Inject, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Campaign } from '../../schemas/campaign.schema';
import { CreateCampaignDto } from '../../dtos/createCampagin.dto';

@Injectable()
export class CampaignsService {
    constructor(
    @Inject('CAMPAGIN_MODEL') private campaignModel: Model<Campaign>
    ) {}

    async createCampaign(tenandId:string,data:CreateCampaignDto): Promise<Campaign> {
        const createdCampaign = new this.campaignModel({
            name: data.name,
            type: data.type,
            status: data.status,
            phoneNumber: data.phoneNumber,
            list: data.list,
            voiceId: data.voiceId,
            lastCallTime: data.lastCallTime,
            completedContacts: data.completedContacts.map(id => new Types.ObjectId(id)),
            user: new Types.ObjectId(data.userId),
            tenandId
        });
        await createdCampaign.save();
        return createdCampaign;
    }

    async getCampaigns(userId:string): Promise<Campaign[]> {
        return this.campaignModel.find({ user: new Types.ObjectId(userId) })
        .populate('user')
        .exec();
    }
}
