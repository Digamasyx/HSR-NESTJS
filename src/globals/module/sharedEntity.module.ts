import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Char } from 'src/char/entity/char.entity';
import { Files } from 'src/file/entity/file.entity';
import { Talent } from 'src/talent/entity/talent.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule],
})
export class UserSharedModule {}

@Module({
  imports: [TypeOrmModule.forFeature([Talent])],
  exports: [TypeOrmModule],
})
export class TalentSharedModule {}

@Module({
  imports: [TypeOrmModule.forFeature([Char])],
  exports: [TypeOrmModule],
})
export class CharSharedModule {}

@Module({
  imports: [TypeOrmModule.forFeature([Files])],
  exports: [TypeOrmModule],
})
export class FilesSharedModule {}
