import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from '../../schemas/appointments.schema';
import { TenantsMiddleware } from 'src/common/middlewares/tenants.middleware';
import { TenantsModule } from 'src/modules/tenants/tenants.module';
import { tenantConnectionProvider } from 'src/common/providers/tenants-connection.provider';
import { tenantModels } from 'src/common/providers/tenants-models.provider';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [AppointmentsController],
  providers: [AppointmentsService,tenantConnectionProvider,
    tenantModels.appointmentModel
  ],
  imports: [
    TenantsModule,
    AuthModule,
    UsersModule,
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema }
    ])
  ],

})

// export class AppointmentsModule{}
export class AppointmentsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(AppointmentsController);
  }
}
