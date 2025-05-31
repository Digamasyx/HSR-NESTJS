import { IsBoolean, IsEnum, IsNumber } from 'class-validator';
import { Effect } from '../enums/talent.enum';
import { Stats } from '@globals/types/stat.types';

export class TalentDTO {
  @IsEnum(Effect)
  effect: Effect;

  stat: Stats;

  @IsNumber()
  value: number;

  @IsBoolean()
  multiplicative: boolean;
}
