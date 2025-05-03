import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@user/entity/user.entity';
import { Repository } from 'typeorm';
import { AuthDTO } from './dto/auth.dto';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { compare } from 'bcrypt';

// ! TESTAR
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signIn(arg: AuthDTO): Promise<{ token: string }> {
    const user = await this.userRepo.findOne({
      where: { name: arg.name },
      select: ['pass', 'is2FAActivated', 'user_uuid', 'access_level'],
    });
    if (!user)
      throw new NotFoundException(
        `User with name ${arg.name} does not exists.`,
      );
    if (!(await compare(arg.pass, user.pass)))
      throw new BadRequestException(
        `The password for the user '${arg.name}' it is incorrect.`,
      );
    if (user.is2FAActivated)
      throw new UnauthorizedException(
        'This user has 2FA activated please login with it.',
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

  // * Agora só deus sabe o que esse codigo faz
  async generate2FASecret(name: string, user: User) {
    const secret = authenticator.generateSecret(256);

    const otpAuthUrl = authenticator.keyuri(user.name, 'Hsr-Nest', secret);

    user.twoFacSecret = secret;
    await this.userRepo.save(user);

    return {
      url: otpAuthUrl,
    };
  }

  // * Converte imagem para URI
  async generateQRDataUrl(otpAuthUrl: string) {
    return toDataURL(otpAuthUrl);
  }

  // * Se { User.is2FAActivated == true } retornará o oposto
  async turn2FA(arg: AuthDTO, code?: string | undefined) {
    if (code && !/^\d{6}$/.test(code))
      throw new BadRequestException('The code must have 6 digits');

    let url: string | null = null;
    const user = await this.userRepo.findOneBy({ name: arg.name });

    if (!user)
      throw new NotFoundException(
        `User with name ${arg.name} does not exists.`,
      );

    user.is2FAActivated = !user.is2FAActivated;

    if (user.is2FAActivated === false) {
      if (code && !this.is2FACodeValid(code, user))
        throw new UnauthorizedException('Wrong code inserted.');

      user.twoFacSecret = null;
      await this.userRepo.save(user);
    }
    if (user.is2FAActivated === true && !user.twoFacSecret) {
      if (!(await compare(arg.pass, user.pass)))
        throw new BadRequestException(
          `The password for the user '${arg.name}' it is incorrect.`,
        );
      url = (await this.generate2FASecret(arg.name, user)).url;
    }

    return {
      message: `Two-Factor authentication was turned ${user.is2FAActivated ? 'on' : 'off'}.`,
      url,
    };
  }

  async is2FACodeValid(twoFactorCode: string, user: User) {
    return authenticator.verify({
      token: twoFactorCode,
      secret: user.twoFacSecret,
    });
  }

  async loginW2FA(userName: string, code: string) {
    if (!/^\d{6}$/.test(code))
      throw new BadRequestException('The code must have 6 digits');

    const user = await this.userRepo.findOne({
      where: { name: userName },
      select: ['twoFacSecret', 'is2FAActivated', 'user_uuid', 'access_level'],
    });

    if (!user)
      throw new NotFoundException(
        `User with name ${userName} does not exists.`,
      );

    if (!user.is2FAActivated)
      throw new UnauthorizedException({
        code: '2FA_REQUIRED',
        message: `Two-factor authentication is not activated for this user.`,
      });

    const isValid = await this.is2FACodeValid(code, user);

    if (!isValid) throw new UnauthorizedException('Invalid code inserted');

    const payload = {
      name: userName,
      uuid: user.user_uuid,
      access_level: user.access_level,
      isTwoFactorAuthenticated: true,
      isTwoFactorAuthenticationEnabled: user.is2FAActivated,
    };

    return {
      token: await this.jwtService.signAsync(payload, {
        secret: process.env.ACCESS_TOKEN,
      }),
    };
  }
}
