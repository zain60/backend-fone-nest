import { Inject, Injectable } from '@nestjs/common';
import { Appointment } from './schemas/appointments.schema';
import { Model, Types } from 'mongoose';
import { AppointmentDto } from './dtos/appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @Inject('APPOINTMENT_MODEL') private appointmentModel: Model<Appointment>,
  ) { }

  async create(tenandId: string, appointmentData: AppointmentDto) {
    const appointment = new this.appointmentModel({
      ...appointmentData,
      tenantId: tenandId,
      user: new Types.ObjectId(appointmentData.userId)
    });
    const savedAppointment = await appointment.save();
    return {
      message: 'Appointment created successfully',
      data: savedAppointment
    };
  }

  async findAll() {
    return this.appointmentModel.find().exec();
  }

  async findByUserId(userId: string) {
    return await this.appointmentModel.find({ user: new Types.ObjectId(userId) })
    .populate('user')
    .exec();
  }

  async findOne(id: string): Promise<Appointment> {
    return this.appointmentModel.findById(id).populate('user').exec();
  }

  async update(id: string, updateData: AppointmentDto) : Promise<Appointment> {
    return await this.appointmentModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async delete(id: string) {
    return this.appointmentModel.findByIdAndDelete(id).exec();
  }

}



