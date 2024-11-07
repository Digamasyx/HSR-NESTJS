import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { Access } from 'src/roles/roles.decorators';
import { AccessLevel } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/roles/roles.guard';
import { CharDTO, UpdateCharDTO } from './dto/char.dto';
import { CharService } from './char.service';
import { IChar } from './interface/char.interface';

@Controller('char')
export class CharController implements IChar {
  constructor(private readonly charService: CharService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Access(AccessLevel.ADMIN)
  @Post()
  create(@Body(new ValidationPipe()) body: CharDTO) {
    return this.charService.create(body);
  }

  @Get(':name')
  find(@Param('name') name: string) {
    return this.charService.find(name);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Access(AccessLevel.ADMIN)
  @Delete(':name')
  remove(@Param('name') name: string) {
    return this.charService.remove(name);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Access(AccessLevel.ADMIN)
  @Patch(':name')
  update(
    @Body(new ValidationPipe()) body: UpdateCharDTO,
    @Param('name') name: string,
  ) {
    return this.charService.update(body, name);
  }
}
