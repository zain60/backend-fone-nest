import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { KnowledgeBaseService } from './knowledge-base.service';
import { KnowledgeBaseController } from './knowledge-base.controller';
import { tenantConnectionProvider } from 'src/common/providers/tenants-connection.provider';
import { tenantModels } from 'src/common/providers/tenants-models.provider';
import { TenantsModule } from '../tenants/tenants.module';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { KnowledgeBase, KnowledgeBaseSchema } from 'src/schemas/knowledgeBase.schema';
import { TenantsMiddleware } from 'src/common/middlewares/tenants.middleware';
import { VapiService } from 'src/libs/services/vapi.service';
import { HttpModule } from '@nestjs/axios';
import { TwlioNumbersModule } from '../twlio-numbers/twlio-numbers.module';


@Module({
  controllers: [KnowledgeBaseController],
  providers: [KnowledgeBaseService,
    tenantConnectionProvider,
    tenantModels.knowledgeBaseModel,VapiService
  ],
  imports: [
      TenantsModule,
      AuthModule,
      HttpModule,
      TwlioNumbersModule,
      MongooseModule.forFeature([
        { name: KnowledgeBase.name, schema: KnowledgeBaseSchema },
      ])
    ],
    exports: [KnowledgeBaseService],
})
export class KnowledgeBaseModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(KnowledgeBaseController);
  }
}
