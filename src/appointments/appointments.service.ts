import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Appointment } from './appointments.schema';
import { Connection, Model } from 'mongoose';
import { AppointmentDto } from './appointment.dto';

@Injectable()
export class AppointmentsService {
    constructor(
        @Inject('APPOINTMENT_MODEL') private appointmentModel: Model<Appointment>,
      ) {}
      async create(appointmentData:AppointmentDto) {
        const appointment = new this.appointmentModel({
          ...appointmentData,
        });
        const savedAppointment = await appointment.save();
        return {
          message: 'Appointment created successfully',
          data: savedAppointment
        };
      }

      async findAll() {
        return this.appointmentModel.find()
      }
    
}



