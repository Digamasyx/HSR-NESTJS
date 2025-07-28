import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      logLevels: ['warn', 'log', 'verbose', 'error', 'debug'],
    }),
  });
  app.use(helmet());
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
