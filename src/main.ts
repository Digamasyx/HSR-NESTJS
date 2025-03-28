import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      logLevels: ['warn', 'log', 'verbose', 'error', 'debug'],
    }),
  });
  await app.listen(3000);
}
bootstrap();
