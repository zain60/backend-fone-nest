import { Inject, Injectable } from '@nestjs/common';
import { CreateTwlioNumberDto } from '../../dtos/create-twlio-number.dto';
import { Model, Types } from 'mongoose';
import { TwilioNumber } from '../../schemas/twilioNumber.schema';

@Injectable()
export class TwlioNumbersService {
  constructor(@Inject('TWILIO_NUMBER_MODEL') private twilioModel: Model<TwilioNumber>) { }

  async create(tenandId: string, createTwlioNumbeData: CreateTwlioNumberDto) {
    const responce = await this.twilioModel.create({
      ...createTwlioNumbeData,
      tenantId: tenandId,
      user: new Types.ObjectId(createTwlioNumbeData.userId)
    })

    return {
      message: "Twilio Number Created Successfully",
      data: responce
    }

  }

  async findAll() {
    const data = await this.twilioModel.find({ isDeleted: false });
    return {
      message: "Retrived All Twilio Numbers",
      data: data
    }
  }

  async findByUserId(userId: string) {
    const data = await this.twilioModel.find({ user: new Types.ObjectId(userId), isDeleted: false });
    return {
      message: `All Twilio Numbers of userid ${userId}`,
      data: data
    }
  }

  async findOne(id: string) {
    const data = await this.twilioModel.findById(id);
    return {
      message: `All Twilio Numbers of id ${id}`,
      data: data
    }
  }

  async update(id: string, updateTData: CreateTwlioNumberDto) {
    const data = await this.twilioModel.findByIdAndUpdate(id, updateTData);
    return {
      message: `record with id ${id} updated successfully`,
      data: data
    }
  }

  async remove(id: string) {
    const data = await this.twilioModel.findByIdAndUpdate(id, { isDeleted: true });
    return {
      message: `record with id ${id} soft removed successfully`,
      data: data
    }
  }

}
