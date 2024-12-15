import { Inject, Injectable } from '@nestjs/common';
import { CreateRecordingDto } from '../../dtos/create-recording.dto';
import { Model, Types } from 'mongoose';
import { Recording } from '../../schemas/recording.schema';

@Injectable()
export class RecordingsService {
  constructor(@Inject('RECORDING_MODEL') private recordingModel: Model<Recording>) {}

  async create(tenandId:string,recordingData: CreateRecordingDto) {
    const createdRecording =  new this.recordingModel({
      ...recordingData,
      tenantId:tenandId,
      user: new Types.ObjectId(recordingData.userId)
    });
    return await createdRecording.save();
  }

 async findAll() {
  return await this.recordingModel.find().exec();
  }

  async findByUserId(userId: string) {
    return await this.recordingModel.find({ user: new Types.ObjectId(userId) }).populate('user')
    .exec();
  }

  async findOne(id: string): Promise<Recording> {
    return this.recordingModel.findById(id).populate('user').exec();
  }

  async update(id: string,updateData: CreateRecordingDto) {
    return this.recordingModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async delete(id: string) {
    return this.recordingModel.findByIdAndDelete(id).exec();
  }
}