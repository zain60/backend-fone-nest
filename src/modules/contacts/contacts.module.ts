import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { tenantConnectionProvider } from 'src/common/providers/tenants-connection.provider';
import { tenantModels } from 'src/common/providers/tenants-models.provider';
import { TenantsModule } from 'src/modules/tenants/tenants.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from '../../schemas/contacts.schema';
import { TenantsMiddleware } from 'src/common/middlewares/tenants.middleware';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [ContactsController],
  providers: [ContactsService,tenantConnectionProvider,
    tenantModels.contactModel
  ],
  imports: [
    TenantsModule,
    UsersModule,
    AuthModule,
    MongooseModule.forFeature([
      { name: Contact.name, schema: ContactSchema }
    ])
  ],
  exports: [ContactsService],
})
export class ContactsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(ContactsController);
  }
}



