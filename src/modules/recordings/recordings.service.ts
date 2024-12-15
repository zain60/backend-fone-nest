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
     await createdRecording.save();
     return {
      data: createdRecording,
      message: "Recording created successfully"
    }
  }

 async findAll() {
  const data =  await this.recordingModel.find().exec();
  return {
    data: data,
    message: "Recordings fetched successfully"
  }
}

  async findByUserId(userId: string) {
    const data =  await this.recordingModel.find({ user: new Types.ObjectId(userId) }).populate('user')
    .exec();
    return {
      data: data,
      message: "Recordings fetched successfully"
    }
  }

  async findOne(id: string) {
    const data =  this.recordingModel.findById(id).populate('user').exec();
    return {
      data: data,
      message: "Recording fetched successfully"
    }
  }

  async update(id: string,updateData: CreateRecordingDto) {
    const data =  this.recordingModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    return {
      data: data,
      message: "Recording updated successfully"
    }
  }

  async delete(id: string) {
    const data = await this.recordingModel.findByIdAndDelete(id).exec();
    return {
      data: data,
      message: "Recording deleted successfully"
    }
  }
}