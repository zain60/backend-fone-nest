import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TenantsConnectionService } from '../shared/services/tenants-connection.service';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    })
  ],
  controllers: [AuthController],
  providers: [AuthService,TenantsConnectionService],
  exports: [AuthService]
})
export class AuthModule {}