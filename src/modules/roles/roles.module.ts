import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Role, RoleSchema } from '../../schemas/roles.schema'
import { MongooseModule } from '@nestjs/mongoose';
import { tenantConnectionProvider } from 'src/common/providers/tenants-connection.provider';
import { tenantModels } from 'src/common/providers/tenants-models.provider';
import { AuthModule } from '../auth/auth.module';
import { TenantsMiddleware } from 'src/common/middlewares/tenants.middleware';
import { TenantsModule } from '../tenants/tenants.module';

@Module({
  imports: [AuthModule,
    TenantsModule,
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  controllers: [RolesController],
  providers: [RolesService,tenantConnectionProvider,
    tenantModels.roleModel
  ],
  exports: [RolesService],
})
export class RolesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantsMiddleware)
      .forRoutes(RolesController);
  }
}
