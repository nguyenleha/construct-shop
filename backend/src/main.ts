import { NestFactory, Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { createValidationPipe } from './common/pipes/validation.pipe';
import { FileTooLargeFilter } from './common/filters/file-too-large.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Security
  app.use(helmet());

  // Validation
  app.useGlobalPipes(createValidationPipe());

  // Apply the custom filter globally
  app.useGlobalFilters(new FileTooLargeFilter());

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  // Configuration
  const configService = app.get(ConfigService);

  // CORS
  app.enableCors({
    origin: configService.get('WEB_URL') || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Versioning
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });

  // Port
  await app.listen(configService.get('PORT_API') || 8888);
}
bootstrap();
