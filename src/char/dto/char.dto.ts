import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberArray } from '../validator/array.validator';
import { Paths, Types } from '../enums/char.enum';
import { PartialType } from '@nestjs/mapped-types';
import { Talent } from '@talent/entity/talent.entity';
import { LevelRange, MappedStat } from '../types/char.types';

export class CharDTO {
  @ApiProperty({
    type: String,
    description: 'Nome do personagem',
    example: 'March 7th',
  })
  @IsString()
  name: string;

  @ApiProperty({
    type: String,
    description: 'Nível do personagem em formato de faixa',
    example: '1/80',
  })
  @IsString()
  level: LevelRange;

  @ApiPropertyOptional({
    type: Number,
    description: 'Ascensão do personagem',
    example: 1,
  })
  @IsOptional()
  asc?: number;

  @ApiProperty({
    type: [Object],
    description: 'Atributos de ataque por nível',
    example: [{ level: 1, value: 100 }],
  })
  @IsArray()
  @IsNumberArray()
  atk: MappedStat[];

  @ApiProperty({
    type: [Object],
    description: 'Atributos de defesa por nível',
    example: [{ level: 1, value: 80 }],
  })
  @IsArray()
  @IsNumberArray()
  def: MappedStat[];

  @ApiProperty({
    type: [Object],
    description: 'Atributos de vida por nível',
    example: [{ level: 1, value: 1200 }],
  })
  @IsArray()
  @IsNumberArray()
  hp: MappedStat[];

  @ApiProperty({
    type: Number,
    description: 'Velocidade do personagem',
    example: 100,
  })
  @IsNumber()
  @IsPositive()
  spd: number;

  @ApiProperty({
    enum: Paths,
    description: 'Trilha do personagem',
    example: Paths.Harmony,
  })
  @IsEnum(Paths)
  path: Paths;

  @ApiProperty({
    enum: Types,
    description: 'Tipo elemental do personagem',
    example: Types.Fire,
  })
  @IsEnum(Types)
  type: Types;

  @ApiPropertyOptional({
    type: () => [Talent],
    description: 'Talentos vinculados ao personagem',
  })
  talent?: Talent[];
}
export class UpdateCharDTO extends PartialType(CharDTO) {}
