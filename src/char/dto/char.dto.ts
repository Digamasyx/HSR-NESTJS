import {
  IsArray,
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { IsNumberArray } from '../validator/array.validator';
import { Paths, Types } from '../enums/char.enum';
import { PartialType } from '@nestjs/mapped-types';
import { Talent } from 'src/talent/entity/talent.entity';
import { LevelRange, MappedStat } from '../types/char.types';

export class CharDTO {
  @IsString()
  name: string;

  @IsString()
  level: LevelRange;

  asc?: number;

  @IsArray()
  @IsNumberArray()
  atk: MappedStat[];

  @IsArray()
  @IsNumberArray()
  def: MappedStat[];

  @IsArray()
  @IsNumberArray()
  hp: MappedStat[];

  @IsNumber()
  @IsPositive()
  spd: number;

  @IsEnum(Paths)
  path: Paths;

  @IsEnum(Types)
  type: Types;

  talent?: Talent[];
}
export class UpdateCharDTO extends PartialType(CharDTO) {}
