import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@auth/auth.guard';
import { Access } from '@roles/roles.decorators';
import { AccessLevel } from '@roles/roles.enum';
import { RolesGuard } from '@roles/roles.guard';
import { CharDTO, UpdateCharDTO } from './dto/char.dto';
import { CharService } from './char.service';
import { IChar } from './interface/char.interface';
import { Paths, Types } from './enums/char.enum';
import { ValidateStringEnumPipe } from './pipes/string-enum.pipe';
import { GlobalExceptionFilter } from '@globals/filter/globalException.filter';
import { Char } from './entity/char.entity';

@Controller('char')
@UseFilters(GlobalExceptionFilter)
export class CharController implements IChar {
  constructor(private readonly charService: CharService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Access(AccessLevel.ADMIN)
  @Post()
  create(@Body(new ValidationPipe()) body: CharDTO) {
    return this.charService.create(body);
  }

  @Get(':name')
  find(@Param('name', ValidateStringEnumPipe) name: string | Paths | Types) {
    return this.charService.find(name);
  }

  @Get()
  findAll(@Query() page = 1, @Query() limit = 10): Promise<Char[]> {
    return this.charService.findAll(page, limit);
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
  @Header('Content-Type', 'text/plain')
  update(
    @Body(new ValidationPipe()) body: UpdateCharDTO,
    @Param('name') name: string,
  ) {
    return this.charService.update(body, name);
  }
}
