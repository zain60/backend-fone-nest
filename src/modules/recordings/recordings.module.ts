import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RecordingsService } from './recordings.service';
import { RecordingsController } from './recordings.controller';
import { tenantConnectionProvider } from 'src/shared/providers/tenants-connection.provider';
import { tenantModels } from 'src/shared/providers/tenants-models.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { Recording,RecordingSchema } from './schemas/recording.schema';
import { TenantsMiddleware } from 'src/shared/middlewares/tenants.middleware';
import { TenantsModule } from '../tenants/tenants.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [RecordingsController],
  providers: [RecordingsService,tenantConnectionProvider,
    tenantModels.recordingModel
  ],
  imports: [
    TenantsModule,
    AuthModule,
    MongooseModule.forFeature([
      { name: Recording.name, schema: RecordingSchema },
    ])
  ],
})
export class RecordingsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantsMiddleware).forRoutes(RecordingsController);
  }
}
