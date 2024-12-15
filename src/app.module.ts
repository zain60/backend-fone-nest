import { Module } from '@nestjs/common';
import { ConfigModule,ConfigService } from '@nestjs/config';
import config from './config/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { TenantsModule } from './modules/tenants/tenants.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { UsersModule } from './modules/users/users.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { RecordingsModule } from './modules/recordings/recordings.module';
import { ListModule } from './modules/list/list.module';
import { RolesModule } from './modules/roles/roles.module';
import { CampaignsModule } from './modules/campaigns/campaigns.module';
import { TwlioNumbersModule } from './modules/twlio-numbers/twlio-numbers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
    isGlobal: true,
    cache: true,
    load:[config]

  }),
  JwtModule.registerAsync ({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get('securreKey.encriptionKey'),
    }),
    global: true,
    inject: [ConfigService],
  }),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (config) => ({
      uri: config.get('database.connectionString'),
    }),
    inject: [ConfigService],
  }),
  AppointmentsModule,
  AuthModule,
  TenantsModule,
  UsersModule,
  ContactsModule,
  RecordingsModule,
  ListModule,
  RolesModule,
  CampaignsModule,
  TwlioNumbersModule
],
  controllers: [],
  providers: [],
})

export class AppModule {}
