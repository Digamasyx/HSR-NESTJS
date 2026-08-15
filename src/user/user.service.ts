import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDTO, UserDTO } from './dto/user.dto';
import { UserProvider } from './user.provider';
import { UserProps } from './types/user.enum';
import { IUser } from './interface/user.interface';
import { CustomRequest } from '@globals/interface/global.interface';
import { GlobalProvider } from '@globals/provider/global.provider';
import { PaginationQueryDTO } from './dto/pagination.dto';
import { AccessLevel } from '@roles/roles.enum';

@Injectable()
export class UserService implements IUser {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private readonly userProvider: UserProvider,
    private readonly globalProvider: GlobalProvider,
  ) {}
  async create(body: UserDTO, req: CustomRequest) {
    const hasPass = !!body.pass;
    const randomPass = body.random_pass;
    if (!hasPass && !randomPass)
      throw new BadRequestException(
        'The password or random_password boolean must be present!',
      );

    const weights =
      body.weights ?? this.userProvider.genRandomNormalizedWeights();

    let pass: string = hasPass ? body.pass : null;

    if (req.login_status === true)
      throw new BadRequestException("You can't be logged in.");

    if (!hasPass)
      // Generate a random password if the pass is not present
      pass = this.userProvider.genRandomString(12, weights);

    body.pass = await this.userProvider.passHash(pass ?? body.pass);

    const user = this.userRepo.create(body);
    await this.userRepo.insert(user);
    return !body.includePassInResponse
      ? this.userProvider.outMessage(UserProps.create_pass, { name: body.name })
      : this.userProvider.outMessage(UserProps.create_wo_pass, {
          name: body.name,
          pass: pass,
        });
  }

  async find(name: string, req: CustomRequest) {
    const { level } = this.userProvider.hasPermission(req);
    if (level === 'None' || level === AccessLevel.USER) {
      const user = await this.userRepo.findOne({
        where: { name },
        select: {
          name: true,
          created_at: true,
        },
      });
      if (!user)
        throw new NotFoundException(`User with name: ${name} does not exists.`);
      else return user;
    }
    const user = await this.userRepo.findOneBy({ name });
    if (!user)
      throw new NotFoundException(`User with name: '${name}' does not exists.`);
    return user;
  }

  async findAll(req: CustomRequest, query: PaginationQueryDTO) {
    const { page, limit } = query;
    const queryBuilder = this.userRepo
      .createQueryBuilder('user')
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('user.created_at', 'DESC');

    const { level } = this.userProvider.hasPermission(req);
    if (level === AccessLevel.USER || level == 'None') {
      queryBuilder.select(['user.name', 'user.created_at']);
    }
    const [users, total] = await queryBuilder.getManyAndCount();
    if (!total) throw new NotFoundException('There are no users registered.');
    return users;
  }

  async delete(name: string, req: CustomRequest) {
    const user = await this.userRepo.findOneBy({ name });
    if (!user)
      throw new NotFoundException(
        `The user with name ${name} does not exists.`,
      );
    const uuid = user.user_uuid;
    if (this.userProvider.hasPermission(req, user).status) {
      await this.userRepo.remove(user);
      return this.userProvider.outMessage(UserProps.delete, {
        name: name,
        uuid: uuid,
      });
    }
    throw new UnauthorizedException(
      `User does not match the required permissions and/or is not the removed user in question.`,
    );
  }

  async update(body: UpdateUserDTO, name: string, req: CustomRequest) {
    const user = await this.userRepo.findOneBy({ name });
    let oldName = '';
    if (!user)
      throw new NotFoundException(
        `User with name ${body.name} does not exists.`,
      );
    const { status, level } = this.userProvider.hasPermission(req, user);
    if (level === 'None' || !status)
      throw new ForbiddenException(
        'User does not meet the required permissions.',
      );

    const allowedProperties: Array<any> = ['name', 'pass'];

    const { changes, alterOrigin } = this.globalProvider.updateAssign(
      body,
      user,
      allowedProperties,
    );
    if (body.pass)
      alterOrigin.pass = await this.userProvider.passHash(alterOrigin.pass);
    if (body.name) oldName = user.name;
    if (body.random_pass) {
      if (body.weights)
        alterOrigin.pass = await this.userProvider.passHash(
          this.userProvider.genRandomString(
            12,
            this.userProvider.genRandomNormalizedWeights(),
          ),
        );
      else
        alterOrigin.pass = await this.userProvider.passHash(
          this.userProvider.genRandomString(12),
        );
    }
    if (Object.keys(alterOrigin).length > 0) {
      Object.assign(user, alterOrigin);
      await this.userRepo.save(user);
    }

    let message = `User ${oldName} updated.`;
    if (changes.length > 0) {
      const changeList = changes.map((c) => `${c.prop}: ${c.from} -> ${c.to}`);
      message += `\nChanges:\n ${changeList.join('\n- ')}`;
      if (body.random_pass) message += `\nRandom_Pass: ${user.pass}`;
    } else {
      message += '\nNo changes were made.';
    }
    return { message: message };
  }
}
