import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ListService } from './list.service';
import { ListController } from './list.controller';
import { tenantConnectionProvider } from 'src/common/providers/tenants-connection.provider';
import { tenantModels } from 'src/common/providers/tenants-models.provider';
import { TenantsModule } from '../tenants/tenants.module';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { List, ListSchema } from './schemas/list.sechema';
import { TenantsMiddleware } from 'src/common/middlewares/tenants.middleware';


@Module({
  controllers: [ListController],
  providers: [ListService,tenantConnectionProvider,
    tenantModels.listModel
  ],
  imports: [
    TenantsModule,
    AuthModule,
    MongooseModule.forFeature([
      { name: List.name, schema: ListSchema },
    ])
  ],
})
export class ListModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(ListController);
  }
}
