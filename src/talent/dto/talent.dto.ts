import { IsBoolean, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Effect } from '../enums/talent.enum';
import { Stats } from '@globals/types/stat.types';
import { PartialType } from '@nestjs/mapped-types';

export class TalentDTO {
  @ApiProperty({
    enum: Effect,
    description: 'Tipo de efeito do talento',
    example: Effect.Buff,
  })
  @IsEnum(Effect)
  effect: Effect;

  @ApiProperty({
    type: String,
    description: 'Estatística afetada pelo talento',
    example: 'atk',
  })
  stat: Stats;

  @ApiProperty({ type: Number, description: 'Valor do talento', example: 10 })
  @IsNumber()
  value: number;

  @ApiProperty({
    type: Boolean,
    description: 'Se o valor é multiplicativo',
    example: true,
  })
  @IsBoolean()
  multiplicative: boolean;
}

export class UpdateTalentDTO extends PartialType(TalentDTO) {}
