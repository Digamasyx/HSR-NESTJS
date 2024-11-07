import { Module } from '@nestjs/common';
import { TalentController } from './talent.controller';
import { TalentService } from './talent.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Talent } from './entity/talent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Talent])],
  controllers: [TalentController],
  providers: [TalentService],
})
export class TalentModule {}
