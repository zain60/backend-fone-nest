import { Controller, Post, Body, UseGuards} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentDto } from './appointment.dto';
import { TenantAuthenticationGuard } from 'src/Guards/tenant-auth.guard';

@UseGuards(TenantAuthenticationGuard)
@Controller('appointments')
export class AppointmentsController {
  appointmentModel: any;
  constructor(private readonly appointmentsService: AppointmentsService,
  ) 
  {}

  @Post('create')
  async create(@Body() appointmentData:AppointmentDto) {
    return this.appointmentsService.create(appointmentData);
  }
}