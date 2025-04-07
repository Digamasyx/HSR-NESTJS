import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserProvider } from './user.provider';
import { UserSharedModule } from '@globals/module/sharedEntity.module';
import { GlobalProvider } from '@globals/provider/global.provider';

@Module({
  imports: [UserSharedModule],
  controllers: [UserController],
  providers: [UserService, UserProvider, GlobalProvider],
})
export class UserModule {}
