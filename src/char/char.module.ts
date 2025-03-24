import { Module } from '@nestjs/common';
import { CharController } from './char.controller';
import { CharService } from './char.service';
import { CharProvider } from './char.provider';
import { CharSharedModule } from '@globals/module/sharedEntity.module';

@Module({
  imports: [CharSharedModule],
  controllers: [CharController],
  providers: [CharService, CharProvider],
})
export class CharModule {}
