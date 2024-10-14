import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';

export class UserDTO {
  @IsString()
  name: string;
  pass?: string;

  log?: boolean = false;
}
export class UpdateUserDTO extends OmitType(PartialType(UserDTO), [
  'log',
] as const) {}
