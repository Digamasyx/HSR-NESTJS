import { User } from '@user/entity/user.entity';
import { UpdateUserDTO, UserDTO, UserResponseDTO } from '../dto/user.dto';
import { CustomRequest } from '@globals/interface/global.interface';
import { PaginationQueryDTO } from '@user/dto/pagination.dto';

export interface IUser {
  find(name: string, req: CustomRequest): Promise<User>;
  findAll(req: CustomRequest, query: PaginationQueryDTO): Promise<Array<User>>;
  create(body: UserDTO, req: CustomRequest): Promise<UserResponseDTO>;
  delete(name: string, req: CustomRequest): Promise<UserResponseDTO>;
  update(
    body: UpdateUserDTO,
    name: string,
    req: CustomRequest,
  ): Promise<UserResponseDTO>;
}
