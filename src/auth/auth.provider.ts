import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { compare } from 'bcrypt';

@Injectable()
export class AuthProvider {
  async checkIfExistsAndCompare(arg: any, pass: string) {
    if (!arg)
      throw new NotFoundException(
        `User with name ${arg.name} does not exists.`,
      );
    if (!(await compare(arg.pass, pass)))
      throw new BadRequestException(
        `The password for the user '${arg.name}' it is incorrect.`,
      );
  }
}
