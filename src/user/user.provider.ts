import {
  BadRequestException,
  Injectable,
  NotImplementedException,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { AccessLevel } from '@roles/roles.enum';
import { UserProps } from './types/user.enum';
import {
  ArgType,
  CreatePassArg,
  CreateWoPassArg,
  DeleteArg,
  UpdateArg,
} from './types/user.type';
import { CustomRequest } from '@globals/interface/global.interface';

@Injectable()
export class UserProvider {
  async passHash(pass: string) {
    const randomSalt = Math.floor(Math.random() * (15 - 10) + 10);
    return await hash(pass, randomSalt);
  }

  userStatus(req: CustomRequest) {
    switch (req.login_status) {
      case false:
        return 'not_logged';
      case true:
        return req.user.access_level === AccessLevel.ADMIN
          ? AccessLevel.ADMIN
          : AccessLevel.USER;
      default:
        return 'not_logged';
    }
  }

  hasPermission(user: any, req: CustomRequest) {
    if (!req.login_status) return false;
    if (req.user.access_level === AccessLevel.ADMIN) return true;
    return req.user.uuid === user.user_uuid;
  }

  /* Adicionar os pesos ao DTO se possivel pesos aleatorios
     possivelmente o tipo seria number[] | boolean | undefined
     caso number[] o tratamento já está feito e tendo tolerancia de 1e-6
     caso boolean gerar os pesos de forma aleatoria e normaliza-los
     caso undefined usar os pesos padrão [1/3, 1/3, 1/3]
  */
  genRandomString(size: number, weights?: number[]) {
    if (!weights) {
      weights = [1 / 3, 1 / 3, 1 / 3];
    } else {
      const total = weights.reduce((acc, num) => acc + num, 0);
      if (Math.abs(total - 1) > 1e-6) {
        throw new BadRequestException('The sum of the weights must be 1.');
      }
    }

    const SYMBOL_CODES = [
      0x21, 0x40, 0x23, 0x24, 0x26, 0x2a, 0x2b, 0x2d, 0x2e, 0x7e,
    ];

    const getRandomCategory = () => {
      let rng = Math.random();
      for (let i = 0; i < weights.length; i++) {
        if (rng < weights[i]) {
          return { type: i, uppercase: Math.random() < 0.5 };
        }
        rng -= weights[i];
      }
      return { type: 0, uppercase: Math.random() < 0.5 };
    };

    const genRandomChar = (uppercase: boolean) => {
      const offset = uppercase ? 65 : 97;
      return String.fromCharCode(Math.floor(Math.random() * 26) + offset);
    };

    const genRandomNumber = () => String(Math.floor(Math.random() * 10));

    const genRandomSymbol = () => {
      const index = Math.floor(Math.random() * SYMBOL_CODES.length);
      return String.fromCharCode(SYMBOL_CODES[index]);
    };

    let result = '';

    for (let i = 0; i < size; i++) {
      const { type, uppercase } = getRandomCategory();
      if (type === 0) result += genRandomChar(uppercase!);
      else if (type === 1) result += genRandomNumber();
      else result += genRandomSymbol();
    }
    return result;
  }

  genRandomNormalizedWeights = () => {
    const weights = Array.from({ length: 3 }, () => Math.random());
    const weightSum = weights.reduce((prev, curr) => prev + curr);
    return weights.map((curr) => curr / weightSum);
  };

  nonNullProperties<T extends object>(arg: Partial<T>): (keyof T)[] {
    const obj = Object.entries(arg);
    const properties: Array<keyof T> = [];
    for (let i = 0; i < obj.length; i++) properties.push(obj[i][0] as keyof T);
    if (typeof properties[0] !== 'string')
      throw new BadRequestException('0 present in request body.');
    return properties;
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
          message: `User with name: ${create_wo_pass.name} was created with the following pass: ${create_wo_pass.pass}`,
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
