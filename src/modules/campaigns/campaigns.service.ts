import { Inject, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Campaign } from '../../schemas/campaign.schema';
import { CreateCampaignDto } from '../../dtos/createCampagin.dto';
import { ListService } from '../list/list.service';
import { ContactsService } from '../contacts/contacts.service';
import { TwlioNumbersService } from '../twlio-numbers/twlio-numbers.service';
import { KnowledgeBaseService } from '../knowledge-base/knowledge-base.service';
import { AssistantService } from 'src/libs/services/assistant.service';

@Injectable()
export class CampaignsService {
    constructor(
    @Inject('CAMPAGIN_MODEL') private campaignModel: Model<Campaign>,
    private listService: ListService,
    private contactsService: ContactsService,
    private twilioService: TwlioNumbersService,
    private knowledgeBaseService: KnowledgeBaseService, 
    private assitantService: AssistantService,
    ) {}

    async createCampaign(tenandId:string,data:CreateCampaignDto) {
        

        const list = await this.listService.findByUserId(data.userId)
        const list_id = list.data[0]._id.toString()

        const contacts = await this.contactsService.findByUserId(data.userId)
        const contacts_id = contacts.data[0]._id.toString()


        const numberId = await this.twilioService.findByUserId(data.userId)
        const number = numberId.data[0].number

        const knowledgeBase = await this.knowledgeBaseService.findByUser(data.userId)
        console.log(knowledgeBase)

        // const bot = await this.assitantService.create(data.userId,knowledgeBase)
        

        const createdCampaign = new this.campaignModel({
            name: data.name,
            type: data.type,
            status: data.status || 'active',
            phoneNumber: number,
            list: new Types.ObjectId(list_id) || null,
            voiceId: data.voiceId,
            lastCallTime: new Date(),
            completedContacts: new Types.ObjectId(contacts_id) || null,
            user: new Types.ObjectId(data.userId),
            tenandId
        });
        await createdCampaign.save();
        return {
            message: 'Campaign created successfully',
            data: createdCampaign
        }
    }

    // async getCampaigns(userId:string) {
    //     const data = await  this.campaignModel.find({ user: new Types.ObjectId(userId) })
    //     .populate('user')
    //     .exec();
    //     return{
    //         message: 'Campaigns retrieved successfully',
    //         data: data
    //     }
    // }

    async getCampaigns(userId: string, page: number = 1, limit: number = 10) {
        console.log(userId)
        const skip = (page - 1) * limit;
        
        const [data, total] = await Promise.all([
            this.campaignModel.find({ user: new Types.ObjectId(userId) })
                .populate('user')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .exec(),
            this.campaignModel.countDocuments({ user: new Types.ObjectId(userId) })
        ]);

        return {
            message: 'Campaigns retrieved successfully',
            data,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit
            }
        };
    }
}
