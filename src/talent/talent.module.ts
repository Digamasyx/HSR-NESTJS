import { Module } from '@nestjs/common';
import { TalentController } from './talent.controller';
import { TalentService } from './talent.service';
import { TalentProvider } from './talent.provider';
import {
  CharSharedModule,
  TalentSharedModule,
} from '@globals/module/sharedEntity.module';
import { GlobalProvider } from '../globals/provider/global.provider';

@Module({
  imports: [TalentSharedModule, CharSharedModule],
  controllers: [TalentController],
  providers: [TalentService, TalentProvider, GlobalProvider],
})
export class TalentModule {}
