import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateKnowledgeBaseDto } from '../../dtos/create-knowledge-base.dto';
import { Model, Types } from 'mongoose';
import { KnowledgeBase } from 'src/schemas/knowledgeBase.schema';
import { VapiService } from 'src/libs/services/vapi.service';
import { TwlioNumbersService } from '../twlio-numbers/twlio-numbers.service';

@Injectable()
export class KnowledgeBaseService {
  constructor(
    @Inject("KNOWLEDGE_BASE_MODEL") private knowledgeBaseModel: Model<KnowledgeBase>,
    private vapiService: VapiService,
    private twilioService: TwlioNumbersService,

  ) { }

  async create(tenantId: string, data: CreateKnowledgeBaseDto) {
    const number = await this.twilioService.findByNumber(data.number);
     // Create knowledge base record
     const knowledgeBase = await this.knowledgeBaseModel.create({
      ...data,
      caller_id: new Types.ObjectId(number._id),
      user: new Types.ObjectId(data.userId),
      tenantId
    });

    // Generate assistant name and get server URL
    const assistantName = `${data.type}_${data.number.replace(/[^0-9]/g, '')}`;
    const serverUrl = data.type.toLowerCase() === 'inbound' 
      ? this.vapiService.inboundServerUrl 
      : this.vapiService.outboundServerUrl;

    // Create assistant with retry logic
    let retryCount = 0;
    let assistant: { id: string; };
    while (retryCount < 3) {
      try {
        assistant = await this.vapiService.createAssistant(
          assistantName,
          data.first_message,
          data.content,
          data.voice_Id || '',
          serverUrl,
          10 * 60
        );
        break;
      } catch (error) {
        retryCount++;
        if (retryCount === 3) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Handle inbound number configuration
    if (data.type.toLowerCase() === 'inbound') {
      if (!number) {
        throw new NotFoundException(`Number ${data.number} not found`);
      }

      try {
        if (!number.vopi_number_id) {
          const vapiNumber = await this.vapiService.importNumber(data.number, assistant.id);
          await this.twilioService.update_from_knowlegeBase(number.id, { 
            vopi_number_id: vapiNumber.id 
          });
        } else {
          await this.vapiService.assignAssistantToNumber(number.vopi_number_id, assistant.id);
        }
      } catch (error) {
        await this.knowledgeBaseModel.findByIdAndDelete(knowledgeBase._id);
        throw new Error(`Failed to configure number: ${error.message}`);
      }
    }

    return knowledgeBase;
  }

  async findAll() {
    return this.knowledgeBaseModel.find().exec()
  }

  findOne(id: string) {
    return this.knowledgeBaseModel.findById(id).exec();
  }

  async update(data: CreateKnowledgeBaseDto) {
    try {
      const number = await this.twilioService.findByNumber(data.number);

      const knowledgeBase = await this.knowledgeBaseModel.findOne({
        user: new Types.ObjectId(data.userId),
        callerId: number._id,
        type: data.type
      });

      if (!knowledgeBase) {
        throw new NotFoundException('Knowledge base not found');
      }

      // Update knowledge base
      const updatedKnowledgeBase = await this.knowledgeBaseModel.findByIdAndUpdate(
        knowledgeBase._id,
        {
          firstMessage: data.first_message,
          content: data.content,
          voiceId: data.voice_Id
        },
        { new: true }
      );

      // Update Vapi assistant
      const response = await this.vapiService.updateAssistant(
        knowledgeBase.assitant_id,
        data.first_message,
        data.content,
        data.voice_Id);

      // Update assistant ID if needed
      await this.knowledgeBaseModel.findByIdAndUpdate(
        knowledgeBase._id,
        { assistantId: response.id }
      );

      return {
        status: true,
        data: response
      };
    } catch (error) {
      return {
        status: false,
        data: error.message
      };
    }
  }

  remove(id: number) {
    return `This action removes a #${id} knowledgeBase`;
  }

  async findByUser(userId: string) {
    return this.knowledgeBaseModel.find({
      user: new Types.ObjectId(userId),
    }).exec();
  }

}
