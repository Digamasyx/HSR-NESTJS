import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserProvider } from './user.provider';
import { UserSharedModule } from '@globals/module/sharedEntity.module';

@Module({
  imports: [UserSharedModule],
  controllers: [UserController],
  providers: [UserService, UserProvider],
})
export class UserModule {}
