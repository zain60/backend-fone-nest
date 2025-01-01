import { Inject, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Campaign } from '../../schemas/campaign.schema';
import { CreateCampaignDto } from '../../dtos/createCampagin.dto';
import { ListService } from '../list/list.service';
import { ContactsService } from '../contacts/contacts.service';
import { TwlioNumbersService } from '../twlio-numbers/twlio-numbers.service';
import { VapiService } from 'src/libs/services/vapi.service';
import { KnowledgeBaseService } from '../knowledge-base/knowledge-base.service';

@Injectable()
export class CampaignsService {
    constructor(
    @Inject('CAMPAGIN_MODEL') private campaignModel: Model<Campaign>,
    private listService: ListService,
    private contactsService: ContactsService,
    private vapiService: VapiService,
    private knowledgeService: KnowledgeBaseService,
    
    // private twilioService: TwlioNumbersService,
    ) {}

    async createCampaign(tenandId:string,data:CreateCampaignDto) {
        

        console.log(data);
        const list = await this.listService.findByName(data.ListName);
        const list_id  = list._id;
        const list_id_contacts = list._id.toString();

        const contacts = await this.contactsService.getContactsByListId(list_id_contacts);
        const contacts_number = contacts.data.map(contact => contact.number);
        console.log(contacts_number);

        const knowlege = this.knowledgeService.findByNumber(contacts_number[0]);
        console.log({knowlege});
        return

        // this.vapiService.callCustomer()

        if(data.type == 'inbound'){
            await this.campaignModel.findOneAndUpdate(
                { 
                    type: 'inbound',
                    phoneNumber: data.phoneNumber,
                    status: 'active'
                },
                { status: 'inactive' }
            );
        }
      
        const createdCampaign = new this.campaignModel({
         ...data,
            list: new Types.ObjectId(list_id) || null,
            user: new Types.ObjectId(data.userId),
            tenandId
        });
        await createdCampaign.save();
        return {
            message: 'Campaign created successfully',
            data: createdCampaign
        }
    }

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
