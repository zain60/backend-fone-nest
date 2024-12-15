import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RecordingsService } from './recordings.service';
import { RecordingsController } from './recordings.controller';
import { tenantConnectionProvider } from 'src/common/providers/tenants-connection.provider';
import { tenantModels } from 'src/common/providers/tenants-models.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { Recording,RecordingSchema } from '../../schemas/recording.schema';
import { TenantsMiddleware } from 'src/common/middlewares/tenants.middleware';
import { TenantsModule } from '../tenants/tenants.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [RecordingsController],
  providers: [RecordingsService,tenantConnectionProvider,
    tenantModels.recordingModel
  ],
  imports: [
    TenantsModule,
    UsersModule,
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
