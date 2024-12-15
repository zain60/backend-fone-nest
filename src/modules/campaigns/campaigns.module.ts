import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { tenantConnectionProvider } from 'src/common/providers/tenants-connection.provider';
import { tenantModels } from 'src/common/providers/tenants-models.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { Campaign, CampaignSchema } from '../../schemas/campaign.schema';
import { TenantsMiddleware } from 'src/common/middlewares/tenants.middleware';
import { TenantsModule } from '../tenants/tenants.module';

@Module({
  controllers: [CampaignsController],
  providers: [CampaignsService,tenantConnectionProvider,
    tenantModels.campaginModel
  ],
  imports: [
    TenantsModule,
    MongooseModule.forFeature([
      { name: Campaign.name, schema: CampaignSchema }
    ])
  ],
})
export class CampaignsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(CampaignsController);
  }
}
