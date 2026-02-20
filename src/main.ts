/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { LoggerService } from './common/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      json: true,
      timestamp: true,
    }),
  });
  const config = new DocumentBuilder()
    .setTitle('Wow CRUD API 67676767')
    .setDescription('Это че домашка? ахуеть')
    .setVersion('0.0.1')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  const logger = app.get(LoggerService);
  app.useLogger(logger);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
