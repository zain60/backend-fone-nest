import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Tenant, TenantSchema } from '../../schemas/tenant.schema';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { tenantConnectionProvider } from 'src/common/providers/tenants-connection.provider';
import { AuthModule } from 'src/modules/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }])
  ],
  providers: [TenantsService,tenantConnectionProvider],
  exports: [TenantsService,tenantConnectionProvider],
  controllers: [TenantsController]
  
})
export class TenantsModule {}
