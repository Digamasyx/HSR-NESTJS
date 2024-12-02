import { Module } from '@nestjs/common';
import { TalentController } from './talent.controller';
import { TalentService } from './talent.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Talent } from './entity/talent.entity';
import { Char } from 'src/char/entity/char.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Talent, Char])],
  controllers: [TalentController],
  providers: [TalentService],
})
export class TalentModule {}
