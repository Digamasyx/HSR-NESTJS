import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { AuthExceptionFilter } from './auth.filter';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseFilters(AuthExceptionFilter)
  signIn(@Body() authDTO: AuthDTO /* , @Request() req */) {
    return this.authService.signIn(authDTO);
  }
}
