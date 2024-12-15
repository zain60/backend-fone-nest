import { Inject, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Campaign } from '../../schemas/campaign.schema';
import { CreateCampaignDto } from '../../dtos/createCampagin.dto';

@Injectable()
export class CampaignsService {
    constructor(
    @Inject('CAMPAGIN_MODEL') private campaignModel: Model<Campaign>
    ) {}

    async createCampaign(tenandId:string,data:CreateCampaignDto) {
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
        return {
            message: 'Campaign created successfully',
            data: createdCampaign
        }
    }

    async getCampaigns(userId:string) {
        const data = await  this.campaignModel.find({ user: new Types.ObjectId(userId) })
        .populate('user')
        .exec();
        return{
            message: 'Campaigns retrieved successfully',
            data: data
        }
    }
}
