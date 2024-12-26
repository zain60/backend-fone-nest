import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CustomLogger } from './common/logger/custom.logger';
import helmet from 'helmet';
import compression from 'compression';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new CustomLogger(),
  });

  const configService = app.get(ConfigService);
  const serverConfig = configService.get('server');
  const corsConfig = configService.get('cors');
  const swaggerConfig = configService.get('swagger');

  // API Configuration
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Security and Performance
  app.use(helmet());
  app.use(compression());
  app.enableCors({
    origin: corsConfig.origin,
    methods: corsConfig.methods,
    credentials: corsConfig.credentials,
  });

  // Validation and Transformation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger Documentation
  if (serverConfig.environment !== 'production') {
    const config = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(swaggerConfig.version)
      .addBearerAuth()
      .addTag('foni')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerConfig.path, app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  // Server Startup
  await app.listen(serverConfig.port);
  const logger = new CustomLogger();
  logger.log(`Server running on ${await app.getUrl()}`, 'Bootstrap');
}

bootstrap().catch((error) => {
  const logger = new CustomLogger();
  logger.error('Application failed to start', error.stack, 'Bootstrap');
  process.exit(1);
});
