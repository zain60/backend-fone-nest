import { Inject, Injectable } from '@nestjs/common';
import { Appointment } from '../../schemas/appointments.schema';
import { Model, Types } from 'mongoose';
import { AppointmentDto } from '../../dtos/appointment.dto';
import { AvailabilityDto } from '../../dtos/availablity.dto';
import { USER_AVAILABILITY_URL } from 'src/libs/utils/constants/baseUrls';
import { User } from '../../schemas/user.schema';
import { UsersService } from '../users/users.service';
// import { groupTimeslotsByDate } from 'src/shared/utils/utils.service';
import { ManageBookingsDto } from '../../dtos/manageBookings.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @Inject('APPOINTMENT_MODEL') private appointmentModel: Model<Appointment>,
    private userService: UsersService,
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
    const  data = await this.appointmentModel.find().exec();
    return {
      message: 'Appointments retrieved successfully',
      data: data
    }
  }

  async findByUserId(userId: string) {
    const data =  await this.appointmentModel.find({ user: new Types.ObjectId(userId) })
      .populate('user')
      .exec();
      return {
        message: 'Appointments retrieved successfully',
        data: data
      }
  }

  async findOne(id: string) {
    const data = await  this.appointmentModel.findById(id).populate('user').exec();
    return {
      message: 'Appointment retrieved successfully',
      data: data
    }
  }

  async update(id: string, updateData: AppointmentDto) {
    const data =  await this.appointmentModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    return {
      message: 'Appointment updated successfully',
      data: data
    }
  }

  async delete(id: string) {
    const data = await  this.appointmentModel.findByIdAndDelete(id).exec();
    return {
      message: 'Appointment deleted successfully',
      data: data
    }
  }

  async getAvailablity(availablityData: AvailabilityDto) {
    const URL = USER_AVAILABILITY_URL
    const { startDate, endDate, userId } = availablityData;
    const userData = await this.userService.findById(userId);
    if (!userData) throw new Error('User not found')
    const { activeEventId, apiKey, duration } = userData.data

    try {
      const apiResponce = await fetch(`${URL}?startTime=${startDate}&endTime=${endDate}&eventTypeId=${activeEventId}&duration=${duration}?slotFormat=range`, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })
      const data = await apiResponce.json();
      // const groupedSlots = groupTimeslotsByDate(data?.data);
      // return groupedSlots;
    } catch (error) {
       console.log(error);
    }

  }

  async manageAppointment(appointmentData: ManageBookingsDto) {
    const { userId,action ,booking_uid,newDateTime} = appointmentData;
    const userData = await this.userService.findById(userId);
    const { activeEventId, apiKey, duration } = userData.data
    if (!userData) throw new Error('User not found')
  }

}



