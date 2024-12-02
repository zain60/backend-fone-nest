import { Module } from '@nestjs/common';
import { ConfigModule,ConfigService } from '@nestjs/config';
import config from './config/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { TenantsModule } from './tenants/tenants.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AppointmentsModule,
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
  UsersModule,
  AuthModule,
  TenantsModule,
  UsersModule,
],
  controllers: [],
  providers: [],
})

export class AppModule {}
