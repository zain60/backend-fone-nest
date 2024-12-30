import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TwlioNumbersService } from './twlio-numbers.service';
import { TwlioNumbersController } from './twlio-numbers.controller';
import { tenantConnectionProvider } from 'src/common/providers/tenants-connection.provider';
import { tenantModels } from 'src/common/providers/tenants-models.provider';
import { TenantsMiddleware } from 'src/common/middlewares/tenants.middleware';
import { TenantsModule } from '../tenants/tenants.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TwilioNumber, TwilioNumberSchema } from '../../schemas/twilioNumber.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [TwlioNumbersController],
  providers: [TwlioNumbersService,tenantConnectionProvider,
    tenantModels.twilioNumberModel
  ],

  imports: [
    TenantsModule,
    AuthModule,
    MongooseModule.forFeature([
      { name: TwilioNumber.name, schema: TwilioNumberSchema },
    ])
  ],
  exports: [TwlioNumbersService],
})
export class TwlioNumbersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(TwlioNumbersController);
  }
}
