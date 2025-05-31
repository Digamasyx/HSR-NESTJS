import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Char } from '@char/entity/char.entity';
import { Files } from '@file/entity/file.entity';
import { Talent } from '@talent/entity/talent.entity';
import { User } from '@user/entity/user.entity';
import { LightCone } from 'src/light-cone/entity/light-cone.entity';

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

@Module({
  imports: [TypeOrmModule.forFeature([LightCone])],
  exports: [TypeOrmModule],
})
export class LightConeSharedModule {}
