import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import packageJson from '../package.json';
import { ConsoleLogger } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const config = new DocumentBuilder()
    .setVersion(packageJson.version)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        in: 'header',
      },
      'JWT-AUTH',
    )
    .build();
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      logLevels: ['warn', 'log', 'verbose', 'error', 'debug'],
    }),
  });
  app.use(helmet());
  app.enableCors();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, { explorer: true });
  await app.listen(3000);
}
bootstrap();
