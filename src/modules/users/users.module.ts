import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { tenantConnectionProvider } from 'src/shared/providers/tenants-connection.provider';
import { tenantModels } from 'src/shared/providers/tenants-models.provider';
import { TenantsMiddleware } from 'src/shared/middlewares/tenants.middleware';
import { TenantsModule } from 'src/modules/tenants/tenants.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    TenantsModule,
    AuthModule,
    JwtModule,
    MongooseModule.forFeature([
    {
      name: User.name,
      schema:UserSchema 

    }])],
  controllers: [UsersController],
  providers: [UsersService,tenantConnectionProvider,
    tenantModels.userModel
  ],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(UsersController);
  }
}


