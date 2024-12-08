import { Inject, Injectable } from '@nestjs/common';
import { CreateRecordingDto } from './dto/create-recording.dto';
import { Model, Types } from 'mongoose';
import { Recording } from './schemas/recording.schema';

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

  findOne(id: number) {
    return `This action returns a #${id} recording`;
  }

  update(id: number, updateRecordingDto) {
    return `This action updates a #${id} recording`;
  }

  remove(id: number) {
    return `This action removes a #${id} recording`;
  }
}
