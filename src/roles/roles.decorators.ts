import { SetMetadata } from '@nestjs/common';
import { AccessLevel } from './roles.enum';

export const ACCESS_KEY = 'access_level';
export const Access = (...AccessLevel: AccessLevel[]) =>
  SetMetadata(ACCESS_KEY, AccessLevel);
