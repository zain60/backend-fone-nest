import { Inject, Injectable } from '@nestjs/common';
import { CreateListDto } from '../../dtos/create-list.dto';
import { List } from '../../schemas/list.sechema';
import { Model, Types } from 'mongoose';

@Injectable()
export class ListService {

  constructor(
   @Inject("LIST_MODEL") private listModel: Model<List>,
  ) {}

  create(tenandId:string,createListData: CreateListDto) {
    return this.listModel.create({
      ...createListData,
     tenantId:tenandId,
      user: new Types.ObjectId(createListData.userId)
    });
  }

  findAll() {
    return this.listModel.find().exec();
  }

  findOne(id: string) {
    return  this.listModel.findById(id).exec();
  }
  findByUserId(userId: string) {
    return  this.listModel.find({ user: new Types.ObjectId(userId) }).populate('user')
    .exec();
  }

  update(id: string, updateData:CreateListDto) {
    return this.listModel.findByIdAndUpdate(id, updateData).exec();
  }

  remove(id: string) {
    return this.listModel.findByIdAndDelete(id).exec();
  }
}
