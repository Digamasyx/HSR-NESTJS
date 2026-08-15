import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Mensagem inicial da API', tags: ['App', 'Health'] })
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
