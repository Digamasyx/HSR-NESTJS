import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Effects } from '../types/effect.type';
import { PartialType } from '@nestjs/mapped-types';

export class LcDTO {
  @ApiProperty({
    type: String,
    description: 'Nome do cone de luz',
    example: 'Poder do Bibliocone',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: Object,
    description: 'Estatísticas do cone de luz',
    example: {
      atk: 100,
      def: 80,
      hp: 1200,
    },
  })
  stats: {
    atk: number;
    def: number;
    hp: number;
  };

  @ApiProperty({
    type: Object,
    description: 'Efeito do cone de luz',
    example: {
      base_effect: 'atk',
      base_effect_type: 'increase',
      stacks: true,
      max_stacks: 3,
      duration: 2,
    },
  })
  effect: Effects;
}
export class UpdateLcDTO extends PartialType(LcDTO) {}
