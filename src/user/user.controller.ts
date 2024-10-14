import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request as Req,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RolesGuard } from 'src/roles/roles.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateUserDTO, UserDTO } from './dto/user.dto';
import { Access } from 'src/roles/roles.decorators';
import { AccessLevel } from 'src/roles/roles.enum';
import { CustomRequest } from './interface/user.interface';
import { IUser } from './interface/user.interface';

@Controller('user')
export class UserController implements IUser {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  create(
    @Body(new ValidationPipe()) userDTO: UserDTO,
    @Req() req: CustomRequest,
  ) {
    return this.userService.create(userDTO, req);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@Req() req: CustomRequest) {
    return this.userService.findAll(req);
  }

  @Get(':name')
  @UseGuards(AuthGuard)
  find(@Param('name') name: string, @Req() req: CustomRequest) {
    return this.userService.find(name, req);
  }

  @Delete(':name')
  @UseGuards(AuthGuard, RolesGuard)
  @Access(AccessLevel.USER, AccessLevel.ADMIN)
  delete(@Param('name') name: string, @Req() req: CustomRequest) {
    return this.userService.delete(name, req);
  }

  @Patch(':name')
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
