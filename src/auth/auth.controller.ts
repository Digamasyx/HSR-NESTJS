import { Body, Controller, Param, Post, UseFilters } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { GlobalExceptionFilter } from '@globals/filter/globalException.filter';

@ApiTags('Auth')
@Controller('auth')
@UseFilters(GlobalExceptionFilter)
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login com JWT', tags: ['Auth', 'Login'] })
  @ApiBody({ type: AuthDTO })
  @Post('login-jwt')
  signIn(@Body() authDTO: AuthDTO) {
    return this.authService.signIn(authDTO);
  }

  @ApiOperation({ summary: 'Ativar/desativar 2FA', tags: ['Auth', '2FA'] })
  @ApiBody({ type: AuthDTO })
  @ApiParam({ name: 'code', required: false, type: String })
  @Post('turn-2fa{/:code}')
  turn2FA(@Body() authDTO: AuthDTO, @Param('code') code?: string) {
    return this.authService.turn2FA(authDTO, code);
  }

  @ApiOperation({ summary: 'Login com 2FA', tags: ['Auth', 'Login'] })
  @ApiParam({ name: 'name', type: String, required: true })
  @ApiParam({ name: 'code', type: String, required: true })
  @Post('login-2fa/:name/:code')
  loginW2FA(@Param('name') name: string, @Param('code') code: string) {
    return this.authService.loginW2FA(name, code);
  }

  @ApiOperation({
    summary: 'Gerar QR code para autenticação',
    tags: ['Auth', '2FA'],
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        url: { type: 'string', example: 'otpauth://...' },
      },
      required: ['url'],
    },
  })
  @Post('gen-qruri')
  generateQRDataUrl(@Body() url: { url: string }) {
    return this.authService.generateQRDataUrl(url.url);
  }
}
