import { Inject, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Campaign } from '../../schemas/campaign.schema';
import { CreateCampaignDto } from '../../dtos/createCampagin.dto';
import { ListService } from '../list/list.service';
import { ContactsService } from '../contacts/contacts.service';
import { TwlioNumbersService } from '../twlio-numbers/twlio-numbers.service';
import { VapiService } from 'src/libs/services/vapi.service';
import { KnowledgeBaseService } from '../knowledge-base/knowledge-base.service';
import { QueueService } from 'src/libs/services/QueueService.service';

@Injectable()
export class CampaignsService {
    constructor(
    @Inject('CAMPAGIN_MODEL') private campaignModel: Model<Campaign>,
    private listService: ListService,
    private contactsService: ContactsService,
    private vapiService: VapiService,
    private knowledgeService: KnowledgeBaseService,
    private queueService: QueueService,
    
    // private twilioService: TwlioNumbersService,
    ) {}

    async createCampaign(tenandId: string, data: CreateCampaignDto) {
        if (data.type === 'inbound') {
            // Set existing inbound campaigns to inactive
            await this.campaignModel.findOneAndUpdate(
                { 
                    type: 'inbound',
                    phoneNumber: data.phoneNumber,
                    status: 'active'
                },
                { status: 'inactive' }
            );
    
            // Create new inbound campaign
            const createdCampaign = new this.campaignModel({
                ...data,
                list: null,
                user: new Types.ObjectId(data.userId),
                tenandId
            });
            await createdCampaign.save();
            return {
                message: 'Inbound campaign created successfully',
                data: createdCampaign
            };
        } else {
            // Handle outbound campaign
            const list = await this.listService.findByName(data.ListName);
            const contacts = await this.contactsService.getContactsByListId(list._id.toString());
            const knowlege = await this.knowledgeService.findByNumber(contacts.data[0].number);

            console.log({knowlege});

            contacts.data.forEach(async (contact) => {

                await this.queueService.addCallJob(
                    contact.number,
                    knowlege.assitant_id,
                    data.phoneNumber                );
            });

            // await this.vapiService.callCustomer(contacts_number[0], knowlege.assitant_id, data.phoneNumber);
    
            const createdCampaign = new this.campaignModel({
                ...data,
                list: new Types.ObjectId(list._id),
                user: new Types.ObjectId(data.userId),
                tenandId
            });
            await createdCampaign.save();
            return {
                message: 'Outbound campaign created successfully',
                data: createdCampaign
            };
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
