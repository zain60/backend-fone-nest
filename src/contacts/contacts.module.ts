import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { tenantConnectionProvider } from 'src/shared/providers/tenants-connection.provider';
import { tenantModels } from 'src/shared/providers/tenants-models.provider';
import { TenantsModule } from 'src/tenants/tenants.module';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from './schemas/contacts.schema';
import { TenantsMiddleware } from 'src/shared/middlewares/tenants.middleware';

@Module({
  controllers: [ContactsController],
  providers: [ContactsService,tenantConnectionProvider,
    tenantModels.contactModel
  ],
  imports: [
    TenantsModule,
    AuthModule,
    MongooseModule.forFeature([
      { name: Contact.name, schema: ContactSchema }
    ])
  ],
})
export class ContactsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(ContactsController);
  }
}



