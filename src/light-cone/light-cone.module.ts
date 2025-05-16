import { Module } from '@nestjs/common';
import { LightConeController } from './light-cone.controller';
import { LightConeService } from './light-cone.service';

@Module({
  controllers: [LightConeController],
  providers: [LightConeService]
})
export class LightConeModule {}
