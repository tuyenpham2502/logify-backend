import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as session from 'express-session';
import { SessionService } from './config/session/session.service';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Set global prefix for all routes
  app.setGlobalPrefix('v1');

  // Enable CORS for local development
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });

  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Apply global response interceptor and exception filter
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Get session service and configure session middleware
  const sessionService = app.get(SessionService);
  app.use(session(sessionService.getSessionConfig()));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Logify API')
    .setDescription('The Logify API for managing application logs')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('logs', 'Log management endpoints')
    .addCookieAuth('connect.sid')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1/api', app, document);

  await app.listen(3000);
}

void bootstrap();
