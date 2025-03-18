import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabseModule } from './database/database.module';
import { CharModule } from './char/char.module';
import { TalentModule } from './talent/talent.module';
import { CustomLogger } from './globals/services/custom-logger.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './globals/interceptors/logging.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    DatabseModule,
    CharModule,
    TalentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CustomLogger,
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
