import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthProvider } from './auth.provider';
import { UserSharedModule } from '@globals/module/sharedEntity.module';
import { GlobalProvider } from '@globals/provider/global.provider';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.ACCESS_TOKEN,
      signOptions: { expiresIn: '1h' },
    }),
    UserSharedModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthProvider, GlobalProvider],
})
export class AuthModule {}
