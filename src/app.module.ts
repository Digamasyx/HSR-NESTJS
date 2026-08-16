import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabseModule } from '@database/database.module';
import { CharModule } from '@char/char.module';
import { TalentModule } from '@talent/talent.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestLoggingInterceptor } from '@globals/interceptors/logging.interceptor';
import { FileModule } from '@file/file.module';
import { LightConeModule } from './light-cone/light-cone.module';
import { RelicsModule } from './relics/relics.module';
import { IoLogger } from '@globals/provider/log.provider';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    DatabseModule,
    CharModule,
    TalentModule,
    FileModule,
    LightConeModule,
    RelicsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    IoLogger,
    { provide: APP_INTERCEPTOR, useClass: RequestLoggingInterceptor },
  ],
})
export class AppModule {}
