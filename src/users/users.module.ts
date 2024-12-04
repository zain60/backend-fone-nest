import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { TenantsMiddleware } from 'src/shared/middlewares/tenants.middleware';
import { tenantConnectionProvider } from 'src/shared/providers/tenants-connection.provider';
import { tenantModels } from 'src/shared/providers/tenants-models.provider';

@Module({
  imports: [
    MongooseModule.forFeature([
    {
      name: User.name,
      schema:UserSchema 

    }])],
  controllers: [UsersController],
  providers: [UsersService,tenantConnectionProvider,
    tenantModels.usersModel
  ]})
  
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(UsersController);
  }
}


