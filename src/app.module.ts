import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabseModule } from './database/database.module';
import { CharModule } from './char/char.module';
import { TalentModule } from './talent/talent.module';

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
  providers: [AppService],
})
export class AppModule {}
