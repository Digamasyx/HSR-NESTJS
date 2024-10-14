import {
  BadRequestException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { AccessLevel } from 'src/roles/roles.enum';
import { UserProps } from './types/user.enum';
import {
  ArgType,
  CreatePassArg,
  CreateWoPassArg,
  DeleteArg,
  UpdateArg,
} from './types/user.type';
import { CustomRequest } from './interface/user.interface';

@Injectable()
export class UserProvider {
  async passHash(pass: string) {
    const randomSalt = Math.floor(Math.random() * (15 - 10) + 10);
    return await hash(pass, randomSalt);
  }
  userStatus(req: CustomRequest) {
    return !req.login_status
      ? 'not_logged'
      : req.user.access_level === AccessLevel.ADMIN
        ? AccessLevel.ADMIN
        : AccessLevel.USER;
  }
  hasPermission(user: any, req: CustomRequest) {
    return !req.login_status
      ? false
      : req.user.access_level === AccessLevel.ADMIN
        ? true
        : req.user.uuid === user.user_uuid
          ? true
          : false;
  }

  // ! Adicionar a geração de senhas e update caso seja senha,
  // ! adicionar campo perguntando se deseja adicionar senha aleatoria
  genRandomString(size: number, weights?: number[]) {
    let weightSum = 0;
    weights
      ? (weightSum = Math.round(
          weights.reduce((acc, weights) => acc + weights, 0),
        ))
      : (() => {
          weights = [];
          for (let i = 0; i < 3; i++) {
            const _ = Math.random();
            weights.push(_);
            weightSum += _;
          }
          weights = weights.map((weight) => weight / weightSum);
          weightSum = Math.round(weights.reduce((acc, curr) => acc + curr));
        })();

    if (weightSum !== 1)
      throw new BadRequestException('Sum of all weights must be 1');

    function randomValue(weights: number[]) {
      let rng = Math.random() * weightSum;
      for (let i = 0; i < weights.length; i++) {
        if (rng < weights[i]) return { value: i, random: Math.random() < 0.5 };
        rng -= weights[i];
      }
      return { value: 0, random: false };
    }

    function genRandomChar(uppercase: boolean) {
      const charCode = uppercase
        ? Math.floor(Math.random() * 26) + 65
        : Math.floor(Math.random() * 26) + 97;
      return String.fromCharCode(charCode);
    }

    function genRandomNumber() {
      return String(Math.floor(Math.random() * 10));
    }

    function genRandomSymbol() {
      const hexValues = [0x21, 0x40, 0x24, 0x26, 0x2a, 0x2b, 0x2d, 0x2e, 0x7e];
      return String.fromCharCode(
        hexValues[Math.floor(Math.random() * hexValues.length)],
      );
    }

    const temp_string = new Array(size).fill(null).map(() => {
      const random = randomValue(weights);
      switch (random.value) {
        case 0:
          return genRandomChar(random.random);
        case 1:
          return genRandomNumber();
        case 2:
          return genRandomSymbol();
        default:
          return void 0;
      }
    });
    return temp_string.join('');
  }

  nonNullProperties<T extends object>(arg: Partial<T>): (keyof T)[] {
    const obj = Object.entries(arg);
    const properties: Array<keyof T> = [];
    for (let i = 0; i < obj.length; i++) properties.push(obj[i][0] as keyof T);
    if (typeof properties[0] !== 'string')
      throw new BadRequestException('0 present in request body.');
    return properties;
  }

  async changeProperties<T extends object>(
    indexes: (keyof T)[],
    curr: any,
    next: Partial<T>,
    random_pass: boolean,
  ) {
    let pass = null;
    for (const i of indexes) {
      if (i === 'random_pass') {
        pass = this.genRandomString(12, [0.7, 0.2, 0.1]);
        curr.pass = await this.passHash(pass);
      }
      if (i === 'pass') {
        curr.pass = await this.passHash(curr.pass);
      }
      curr[i] = next[i];
    }
    return random_pass ? [curr, pass] : [curr, 0];
  }

  outMessage<T extends UserProps, K extends object>(
    caller: T,
    arg: ArgType<T, K>,
  ): { message: string } {
    switch (caller) {
      case UserProps.create_pass:
        const create_pass = arg as CreatePassArg;
        return { message: `User with name: ${create_pass.name} was created.` };
      case UserProps.create_wo_pass:
        const create_wo_pass = arg as CreateWoPassArg;
        return {
          message: `User with name: ${create_wo_pass.name} was create with the following pass: ${create_wo_pass.pass}`,
        };
      case UserProps.delete:
        const delete_arg = arg as DeleteArg;
        return {
          message: `User with name: '${delete_arg.name}' & UUID: '${delete_arg.uuid}' was deleted.`,
        };
      case UserProps.update:
        const update_arg = arg as UpdateArg<K>;
        return {
          message: `The following field(s) were changed: '${update_arg.properties.join(', ')}'`,
        };
      case UserProps.update_w_random:
        const update_w_random = arg as UpdateArg<K> &
          Omit<CreateWoPassArg, 'name'>;
        return {
          message: `The following field(s) were changed: '${update_w_random.properties.join(', ')}' with pass '${update_w_random.pass}'`,
        };
      default:
        throw new NotImplementedException('Caller not implemented.');
    }
  }
}
