import { Module } from '@nestjs/common';
import { CharController } from './char.controller';
import { CharService } from './char.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Char } from './entity/char.entity';
import { CharProvider } from './char.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Char])],
  controllers: [CharController],
  providers: [CharService, CharProvider],
})
export class CharModule {}
