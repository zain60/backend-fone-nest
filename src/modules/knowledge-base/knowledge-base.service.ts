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

  async findByUser(userId: string) {
    return this.knowledgeBaseModel.find({
      user: new Types.ObjectId(userId),
    }).exec();
  }

  // create aservice to get record based on phoe umber
  async findByNumber(Phonenumber: string) {
    // Normalize phone number by removing all non-digit characters except +
    const number = '' + Phonenumber.replace(/[^\d+]/g, '');
    const numberData = await this.twilioService.findByNumber(number);
    return this.knowledgeBaseModel.findOne({
      caller_id: numberData._id,
      type: 'outbound'
    }).exec();
  }

  async create(tenantId: string, data: CreateKnowledgeBaseDto) {
    // Validate number existence upfront
    const number = await this.twilioService.findByNumber(data.number);
    if (data.type.toLowerCase() === 'inbound' && !number) {
      throw new NotFoundException(`Number ${data.number} not found`);
    }

    // Create knowledge base record with initial data
    const knowledgeBase = await this.knowledgeBaseModel.create({
      ...data,
      caller_id: new Types.ObjectId(number._id),
      user: new Types.ObjectId(data.userId),
      tenantId
    });

    try {
      // Generate assistant name and get server URL
      const assistantName = `${data.type}_${data.number.replace(/[^0-9]/g, '')}`;
      const serverUrl = data.type.toLowerCase() === 'inbound'
        ? this.vapiService.inboundServerUrl
        : this.vapiService.outboundServerUrl;

      // Create assistant with retry logic
      const assistant = await this.createAssistantWithRetry(
        assistantName,
        data.first_message,
        data.content,
        data.voice_Id || '',
        serverUrl
      );

      // Handle inbound configuration if needed
      if (data.type.toLowerCase() === 'inbound') {
        await this.configureInboundNumber(number, assistant.id);
      }

      // Update and return knowledge base with assistant ID
      const KnowledgeData = await this.knowledgeBaseModel.findByIdAndUpdate(
        knowledgeBase._id,
        { assitant_id: assistant.id },
        { new: true }
      );

      console.log(KnowledgeData)

      return KnowledgeData

    } catch (error) {
      await this.knowledgeBaseModel.findByIdAndDelete(knowledgeBase._id);
      throw new Error(`Operation failed: ${error.message}`);
    }
  }

  private async createAssistantWithRetry(
    assistantName: string,
    firstMessage: string,
    content: string,
    voiceId: string,
    serverUrl: string,
    maxRetries = 3
  ): Promise<{ id: string }> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.vapiService.createAssistant(
          assistantName,
          firstMessage,
          content,
          voiceId,
          serverUrl,
          10 * 60
        );
      } catch (error) {
        if (attempt === maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  private async configureInboundNumber(number: any, assistantId: string): Promise<void> {
    if (!number.vopi_number_id) {
      const vapiNumber = await this.vapiService.importNumber(number.number, assistantId);
      await this.twilioService.update_from_knowlegeBase(number.id, {
        vopi_number_id: vapiNumber.id
      });
    } else {
      await this.vapiService.assignAssistantToNumber(number.vopi_number_id, assistantId);
    }
  }
}
