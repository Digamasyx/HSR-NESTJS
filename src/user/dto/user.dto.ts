import { PartialType, OmitType } from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsSumBetween } from '@user/validator/array.sum.validator';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UserDTO {
  @ApiProperty({
    type: String,
    description: 'Nome do usuário',
    example: 'john_doe',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @ApiPropertyOptional({
    type: String,
    format: 'password',
    description: 'Senha do usuário',
    example: 'Abc12345!',
  })
  pass?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    type: Boolean,
    default: false,
    description: 'Define se a senha deve ser gerada aleatoriamente',
    example: false,
  })
  random_pass?: boolean = false;

  @IsBoolean()
  @IsOptional()
  @ApiPropertyOptional({
    type: Boolean,
    default: false,
    description: 'Define se a senha inserida deve ser retornada',
    example: false,
  })
  includePassInResponse?: boolean = false;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  @IsNumber({}, { each: true })
  @IsSumBetween(1, 1)
  @ApiPropertyOptional({
    type: [Number],
    isArray: true,
    maxItems: 3,
    default: [1 / 3, 1 / 3, 1 / 3],
    example: [0.333, 0.333, 0.333],
    description: 'Pesos do usuário em formato de array numérico',
  })
  weights?: number[];
}
export class UpdateUserDTO extends OmitType(PartialType(UserDTO), [
  'includePassInResponse',
] as const) {}
export class UserResponseDTO {
  @ApiProperty({ type: String, description: 'Retorno usual do endpoint' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
