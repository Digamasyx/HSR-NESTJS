import { Module } from '@nestjs/common';
import { LightConeController } from './light-cone.controller';
import { LightConeService } from './light-cone.service';
import {
  CharSharedModule,
  LightConeSharedModule,
} from '@globals/module/sharedEntity.module';
import { GlobalProvider } from '@globals/provider/global.provider';
import { LightConeProvider } from './light-cone.provider';

@Module({
  imports: [LightConeSharedModule, CharSharedModule],
  controllers: [LightConeController],
  providers: [LightConeService, GlobalProvider, LightConeProvider],
})
export class LightConeModule {}
