import { AccessLevel } from 'src/roles/roles.enum';
import { Request } from 'express';

export interface CustomRequest extends Request {
  login_status: boolean;
  user?: {
    uuid: string;
    access_level: AccessLevel;
    name: string;
  };
}
