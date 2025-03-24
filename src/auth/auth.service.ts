import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { AuthDTO } from './dto/auth.dto';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { AuthProvider } from './auth.provider';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private authProvider: AuthProvider,
    private jwtService: JwtService,
  ) {}

  async signIn(arg: AuthDTO): Promise<{ token: string }> {
    const user = await this.userRepo.findOneBy({ name: arg.name });
    await this.authProvider.checkIfExistsAndCompare(arg, user.pass);
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

  // * Só eu e deus sabe o que esse codigo faz
  async gen2FASecret(arg: AuthDTO) {
    const user = await this.userRepo.findOneBy({ name: arg.name });

    if (!user.is2FAActivated)
      throw new UnauthorizedException(
        'Two-factor authentication is deactivated for this user.',
      );

    await this.authProvider.checkIfExistsAndCompare(arg, user.pass);

    const secret = authenticator.generateSecret(256);

    const otpAuthUrl = authenticator.keyuri(user.name, 'Hsr-Nest', secret);

    user.twoFacSecret = secret;
    await this.userRepo.save(user);

    return {
      token: secret,
      url: otpAuthUrl,
    };
  }

  // * Converte imagem para URI
  async generateQRDataUrl(otpAuthUrl: string) {
    return toDataURL(otpAuthUrl);
  }

  // * Se { User.is2FAActivated == true } retornará o oposto
  async turn2FA(arg: AuthDTO) {
    const user = await this.userRepo.findOneBy({ name: arg.name });

    await this.authProvider.checkIfExistsAndCompare(arg, user.pass);

    user.is2FAActivated = !user.is2FAActivated;

    if (user.is2FAActivated === false) user.twoFacSecret = null;

    await this.userRepo.save(user);

    return {
      message: `Two-Factor authentication was turned ${user.is2FAActivated ? 'on' : 'off'}.`,
    };
  }

  async is2FACodeValid(twoFactorCode: string, user: User) {
    return authenticator.verify({
      token: twoFactorCode,
      secret: user.twoFacSecret,
    });
  }

  async loginW2FA(userName: string, code: string) {
    const user = await this.userRepo.findOneBy({ name: userName });
    user.twoFacSecret = (
      await this.userRepo.findOne({
        where: { name: userName },
        select: { twoFacSecret: true },
      })
    ).twoFacSecret;

    if (!user.is2FAActivated)
      throw new UnauthorizedException(
        `Two-factor authentication is not activated for this user.`,
      );

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
