import { Module } from '@nestjs/common';
import { CharController } from './char.controller';
import { CharService } from './char.service';
import { CharProvider } from './char.provider';
import { CharSharedModule } from '@globals/module/sharedEntity.module';
import { GlobalProvider } from '@globals/provider/global.provider';

@Module({
  imports: [CharSharedModule],
  controllers: [CharController],
  providers: [CharService, CharProvider, GlobalProvider],
})
export class CharModule {}
