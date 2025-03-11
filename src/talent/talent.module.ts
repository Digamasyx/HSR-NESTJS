import { Module } from '@nestjs/common';
import { TalentController } from './talent.controller';
import { TalentService } from './talent.service';
import { TalentProvider } from './talent.provider';
import {
  CharSharedModule,
  TalentSharedModule,
} from 'src/globals/module/sharedEntity.module';

@Module({
  imports: [TalentSharedModule, CharSharedModule],
  controllers: [TalentController],
  providers: [TalentService, TalentProvider],
})
export class TalentModule {}
