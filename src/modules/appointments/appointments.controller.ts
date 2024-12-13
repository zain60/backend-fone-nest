import { Controller, Post, Body, UseGuards, Req, Get, Patch, Delete, Param, Put } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentDto } from './dtos/appointment.dto';
import { TenantAuthenticationGuard } from 'src/Guards/tenant-auth.guard';
import { AvailabilityDto } from './dtos/availablity.dto';
import { ManageBookingsDto } from './dtos/manageBookings.dto';

@UseGuards(TenantAuthenticationGuard)
@Controller('appointments')
export class AppointmentsController {
  appointmentModel: any;
  constructor(private readonly appointmentsService: AppointmentsService,) { }

  @Post()
  async create(@Req() request: Request, @Body() appointmentData: AppointmentDto) {
    const tenandId = request.headers['x-tenant-id']?.toString()
    return this.appointmentsService.create(tenandId, appointmentData);
  }

  @Get()
  async findAll() {
    return this.appointmentsService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id)
  }

  @Get('user/:id')
  async findByUserId(@Param('id') id: string) {
    return this.appointmentsService.findByUserId(id)
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: AppointmentDto) {
    return this.appointmentsService.update(id, updateData);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.appointmentsService.delete(id);
  }

  // end point to get available slots from the calcom user calnder

  @Post('availability')
  async getAvailablity(@Body() availablityData: AvailabilityDto) {
    return this.appointmentsService.getAvailablity(availablityData)
  }

  @Post('manage-bookings')
  async manageBookings(@Body() bookingData: ManageBookingsDto) {
    // return this.appointmentsService.manageBookings(availablityData)
  }
}