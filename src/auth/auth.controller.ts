﻿import { Body, Controller, Param, Post, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { GlobalExceptionFilter } from '@globals/filter/globalException.filter';

@Controller('auth')
@UseFilters(GlobalExceptionFilter)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login-jwt')
  signIn(@Body() authDTO: AuthDTO) {
    return this.authService.signIn(authDTO);
  }
  @Post('turn-2fa{/:code}')
  turn2FA(@Body() authDTO: AuthDTO, @Param('code') code?: string) {
    return this.authService.turn2FA(authDTO, code);
  }
  @Post('login-2fa/:name/:code')
  loginW2FA(@Param('name') name: string, @Param('code') code: string) {
    return this.authService.loginW2FA(name, code);
  }
  @Post('gen-qruri')
  generateQRDataUrl(@Body() url: { url: string }) {
    return this.authService.generateQRDataUrl(url.url);
  }
}
