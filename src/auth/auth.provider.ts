import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { compare } from 'bcrypt';

@Injectable()
export class AuthProvider {
  formatDate(arg: Date) {
    const day = String(arg.getDate()).padStart(2, '0');
    //? getMonth() retorna 0-11, então adiciona-se 1
    const month = String(arg.getMonth() + 1).padStart(2, '0');
    const hours = String(arg.getHours()).padStart(2, '0');
    const minutes = String(arg.getMinutes()).padStart(2, '0');
    const seconds = String(arg.getSeconds()).padStart(2, '0');
    const year = String(arg.getFullYear());

    return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
  }
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
