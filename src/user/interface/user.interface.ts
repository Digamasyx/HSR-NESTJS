import { User } from 'src/user/entities/user.entity';
import { UpdateUserDTO, UserDTO } from '../dto/user.dto';
import { Request } from 'express';
import { AccessLevel } from 'src/roles/roles.enum';

export interface CustomRequest extends Request {
  login_status: boolean;
  user?: {
    uuid: string;
    access_level: AccessLevel;
    name: string;
  };
}

export interface IUser {
  find(name: string, req: CustomRequest): Promise<User>;
  findAll(req: CustomRequest): Promise<Array<User>>;
  create(
    body: UserDTO,
    req: CustomRequest,
  ): Promise<{ message: string } | void>;
  delete(name: string, req: CustomRequest): Promise<{ message: string }>;
  update(
    body: UpdateUserDTO,
    name: string,
    req: CustomRequest,
  ): Promise<{ message: string }>;
}
