import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDTO, UserDTO } from './dto/user.dto';
import { UserProvider } from './user.provider';
import { UserProps } from './types/user.enum';
import { IUser } from './interface/user.interface';
import { CustomRequest } from 'src/globals/interface/global.interface';

@Injectable()
export class UserService implements IUser {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly userProvider: UserProvider,
  ) {}

  async create(body: UserDTO, req: CustomRequest) {
    const isPassNotPresent = !body.pass;
    let pass = null;
    if (req.login_status === true)
      throw new BadRequestException('You must be not logged.');
    if (isPassNotPresent)
      pass = this.userProvider.genRandomString(12, [0.7, 0.2, 0.1]);

    body.pass = await this.userProvider.passHash(pass ?? body.pass);

    const user = this.userRepo.create(body);
    await this.userRepo.insert(user);
    // * If pass is present and the request does not require a log return void 0
    if (!body.log && !isPassNotPresent) return void 0;
    return !isPassNotPresent
      ? this.userProvider.outMessage(UserProps.create_pass, { name: body.name })
      : this.userProvider.outMessage(UserProps.create_wo_pass, {
          name: body.name,
          pass: pass,
        });
  }

  async find(name: string, req: CustomRequest) {
    const userStatus = this.userProvider.userStatus(req);
    if (userStatus === 'not_logged' || userStatus === 'User') {
      const user = await this.userRepo.findOne({
        where: { name },
        select: {
          name: true,
          created_at: true,
        },
      });
      if (!user)
        throw new BadRequestException(
          `User with name: ${name} does not exists.`,
        );
      else return user;
    }
    const user = await this.userRepo.findOneBy({ name });
    if (!user)
      throw new BadRequestException(
        `User with name: '${name}' does not exists.`,
      );
    return user;
  }

  async findAll(req: CustomRequest) {
    const userStatus = this.userProvider.userStatus(req);
    if (userStatus === 'not_logged' || userStatus === 'User') {
      return await this.userRepo.find({
        select: {
          name: true,
          created_at: true,
        },
      });
    }
    return await this.userRepo.find();
  }

  async delete(name: string, req: CustomRequest) {
    const user = await this.userRepo.findOneBy({ name });
    const uuid = user.user_uuid;
    if (this.userProvider.hasPermission(user, req)) {
      await this.userRepo.remove(user);
      return this.userProvider.outMessage(UserProps.delete, {
        name: name,
        uuid: uuid,
      });
    }
    // ? Adicionar metodo identico ao outMessage so que para erros e que receba { HttpStatus } como tipo
    throw new UnauthorizedException(
      `User does not match the required permissions and/or is not the removed user in question.`,
    );
  }

  async update(body: UpdateUserDTO, name: string, req: CustomRequest) {
    let user = await this.userRepo.findOneBy({ name });
    if (!this.userProvider.hasPermission(user, req))
      throw new ForbiddenException(
        'User does not meet the required permissions.',
      );
    const properties = this.userProvider.nonNullProperties(body);

    // ! Melhorar logica para o caso seja inserido a senha e random = true
    // if (properties.includes('random_pass')) {
    //   const pass = this.userProvider.genRandomString(12, [0.7, 0.2, 0.1]);
    //   user.pass = await this.userProvider.passHash(pass);
    // }
    // if (properties.includes('pass')) {
    //   user.pass = await this.userProvider.passHash(body.pass);
    // }
    let pass = null;
    [user, pass] = await this.userProvider.changeProperties(
      properties,
      user,
      body,
      body.random_pass,
    );
    await this.userRepo.save(user);
    // ! Testar mensagem de retorno
    if (!body.random_pass) {
      return this.userProvider.outMessage(UserProps.update, { properties });
    } else {
      return this.userProvider.outMessage(UserProps.update_w_random, {
        properties,
        pass: pass,
      });
    }
  }
}
