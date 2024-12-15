import { Inject, Injectable } from '@nestjs/common';
import { CreateListDto } from '../../dtos/create-list.dto';
import { List } from '../../schemas/list.sechema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ListService {

  constructor(
   @Inject("LIST_MODEL") private listModel: Model<List>,
  ) {}

  async create(tenandId:string,createListData: CreateListDto) {
    const data =  await this.listModel.create({
      ...createListData,
     tenantId:tenandId,
      user: new Types.ObjectId(createListData.userId)
    });
    return {
      data: data,
      message: "List created successfully"
    }
  }

  async findAll() {
    const data = await this.listModel.find().exec();
    return {
      data: data,
      message: "List fetched successfully"
    }
  }

  async findOne(id: string) {
    const data = await  this.listModel.findById(id).exec();
    return {
      data: data,
      message: "List fetched successfully"
    }
  }

  async findByUserId(userId: string) {
    const data = await  this.listModel.find({ user: new Types.ObjectId(userId) }).populate('user')
    .exec();
    return {
      data: data,
      message: "List fetched successfully"
    }
  }

  async update(id: string, updateData:CreateListDto) {
    const data = await this.listModel.findByIdAndUpdate(id, updateData).exec();
    return {
      data: data,
      message: "List updated successfully"
    }
  }

  async remove(id: string) {
    const data = await this.listModel.findByIdAndDelete(id).exec();
    return {
      data: data,
      message: "List deleted successfully"
    }
  }
}
