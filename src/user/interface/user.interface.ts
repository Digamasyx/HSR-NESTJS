import { User } from 'src/user/entity/user.entity';
import { UpdateUserDTO, UserDTO } from '../dto/user.dto';
import { CustomRequest } from 'src/globals/interface/global.interface';

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
