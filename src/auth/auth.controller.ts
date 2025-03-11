import { Body, Controller, Param, Post, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { AuthExceptionFilter } from './auth.filter';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login-jwt')
  @UseFilters(AuthExceptionFilter)
  signIn(@Body() authDTO: AuthDTO /* , @Request() req */) {
    return this.authService.signIn(authDTO);
  }
  @Post('turn-2fa')
  @UseFilters(AuthExceptionFilter)
  turn2FA(@Body() authDTO: AuthDTO) {
    return this.authService.turn2FA(authDTO);
  }
  @Post('gen-2fa')
  @UseFilters(AuthExceptionFilter)
  gen2FASecret(@Body() authDTO: AuthDTO) {
    return this.authService.gen2FASecret(authDTO);
  }
  @Post('login-2fa/:name/:code')
  @UseFilters(AuthExceptionFilter)
  loginW2FA(@Param('name') name: string, @Param('code') code: string) {
    return this.authService.loginW2FA(name, code);
  }
  @Post('gen-qruri')
  generateQRDataUrl(@Body() url: { url: string }) {
    return this.authService.generateQRDataUrl(url.url);
  }
}
