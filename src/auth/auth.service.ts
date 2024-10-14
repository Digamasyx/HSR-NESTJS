import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { AuthDTO } from './dto/auth.dto';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(arg: AuthDTO): Promise<{ token: string }> {
    const user = await this.userRepo.findOne({ where: { name: arg.name } });
    if (!user)
      throw new NotFoundException(
        `User with name ${arg.name} does not exists.`,
      );
    if (!(await compare(arg.pass, user.pass)))
      throw new BadRequestException(
        `The password for the user '${arg.name}' it is incorrect.`,
      );
    const payload = {
      name: user.name,
      uuid: user.user_uuid,
      access_level: user.access_level,
    };
    return {
      token: await this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN,
      }),
    };
  }
}
