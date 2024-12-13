import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configdata = new DocumentBuilder()
    .setTitle('foni-backend')
    .setDescription('This is the backend for foni')
    .setVersion('1.0')
    .addTag('foni')
    .build();

    const documentFactory = () => SwaggerModule.createDocument(app, configdata);
    SwaggerModule.setup('api', app, documentFactory);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false,
  }));
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  const config = app.get(ConfigService);
  await app.listen(config.get('server.port'));
}

bootstrap();
