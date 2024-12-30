import { Inject, Injectable } from '@nestjs/common';
import { CreateKnowledgeBaseDto } from '../../dtos/create-knowledge-base.dto';
import { Model, Types } from 'mongoose';
import { KnowledgeBase } from 'src/schemas/knowledgeBase.schema';

@Injectable()
export class KnowledgeBaseService {
  constructor(
    @Inject("KNOWLEDGE_BASE_MODEL") private knowledgeBaseModel: Model<KnowledgeBase>,
  ) { }
  
  async create(tenantId: string, createKnowledgeBaseDto: CreateKnowledgeBaseDto) {
    return await this.knowledgeBaseModel.create({
      ...createKnowledgeBaseDto,
      user: new Types.ObjectId(createKnowledgeBaseDto.userId),
      tenantId
    });
  }

  async findAll() {
    return this.knowledgeBaseModel.find().exec()
  }

  findOne(id: string) {
    return this.knowledgeBaseModel.findById(id).exec();
  }

  update(id: number, updateKnowledgeBaseDto) {
    return `This action updates a #${id} knowledgeBase`;
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
