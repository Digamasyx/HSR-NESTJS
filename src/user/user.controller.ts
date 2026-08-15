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
  Request as Req,
  UseFilters,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RolesGuard } from '@roles/roles.guard';
import { AuthGuard } from '@auth/auth.guard';
import { UpdateUserDTO, UserDTO } from './dto/user.dto';
import { Access } from '@roles/roles.decorators';
import { AccessLevel } from '@roles/roles.enum';
import { IUser } from './interface/user.interface';
import { CustomRequest } from '@globals/interface/global.interface';
import { GlobalExceptionFilter } from '@globals/filter/globalException.filter';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

// ! TODO: adicionar o resto
@ApiBearerAuth('JWT-AUTH')
@ApiTags('User')
@UseFilters(GlobalExceptionFilter)
@Controller('user')
export class UserController implements IUser {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ tags: ['User', 'Create'] })
  @ApiBody({ type: UserDTO })
  @Post('create')
  @UseGuards(AuthGuard)
  create(
    @Body(new ValidationPipe()) userDTO: UserDTO,
    @Req() req: CustomRequest,
  ) {
    return this.userService.create(userDTO, req);
  }

  @Get()
  @ApiOperation({ summary: 'Listar usuários', tags: ['User', 'List'] })
  @ApiQuery({ name: 'page', type: Number, required: false, example: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, example: 10 })
  @UseGuards(AuthGuard)
  findAll(
    @Req() req: CustomRequest,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.userService.findAll(req, page, limit);
  }

  @Get(':name')
  @ApiOperation({ summary: 'Buscar usuário por nome', tags: ['User', 'Read'] })
  @ApiParam({ name: 'name', type: String, required: true })
  @UseGuards(AuthGuard)
  find(@Param('name') name: string, @Req() req: CustomRequest) {
    return this.userService.find(name, req);
  }

  @Delete(':name')
  @ApiOperation({ summary: 'Excluir usuário', tags: ['User', 'Delete'] })
  @ApiParam({ name: 'name', type: String, required: true })
  @UseGuards(AuthGuard, RolesGuard)
  @Access(AccessLevel.USER, AccessLevel.ADMIN)
  delete(@Param('name') name: string, @Req() req: CustomRequest) {
    return this.userService.delete(name, req);
  }

  @Header('Content-Type', 'text/plain')
  @Patch(':name')
  @ApiOperation({ summary: 'Atualizar usuário', tags: ['User', 'Update'] })
  @ApiParam({ name: 'name', type: String, required: true })
  @UseGuards(AuthGuard, RolesGuard)
  @Access(AccessLevel.USER, AccessLevel.ADMIN)
  update(
    @Body() body: UpdateUserDTO,
    @Param('name') name: string,
    @Req() req: CustomRequest,
  ) {
    return this.userService.update(body, name, req);
  }
}
