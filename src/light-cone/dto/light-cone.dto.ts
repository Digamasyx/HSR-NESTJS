import { IsString } from 'class-validator';
import { Effects } from '../types/effect.type';
import { PartialType } from '@nestjs/mapped-types';

export class LcDTO {
  @IsString()
  name: string;

  stats: {
    atk: number;
    def: number;
    hp: number;
  };

  effect: Effects;
}
export class UpdateLcDTO extends PartialType(LcDTO) {}
