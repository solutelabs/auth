import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PORT } from './core/environment';
import { start } from './index';

async function bootstrap() {
  // check all env variable are present
  await start();

  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.setGlobalPrefix('api');

  const options = new DocumentBuilder().setTitle('Auth Microservice').setDescription('Auth Microservices Feature')
  .setVersion('1.0.0').build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api',app, document);

  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
    forbidNonWhitelisted:true
  }));
  app.enableCors();

  await app.listen(PORT || 3000);
  Logger.debug(`🚀  Server is listening on port ${PORT}`);
}

// Start Application
bootstrap().catch((e) => {
  Logger.error(`❌  Error starting server, ${e}`);
  throw e;
});