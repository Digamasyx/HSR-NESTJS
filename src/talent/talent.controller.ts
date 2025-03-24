import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { TalentService } from './talent.service';
import { AuthGuard } from '@auth/auth.guard';
import { RolesGuard } from '@roles/roles.guard';
import { Access } from '@roles/roles.decorators';
import { AccessLevel } from '@roles/roles.enum';
import { TalentDTO } from './dto/talent.dto';

@Controller('talent')
export class TalentController {
  constructor(private readonly talentService: TalentService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Access(AccessLevel.ADMIN)
  @Post(':charName')
  create(
    @Body(new ValidationPipe()) body: TalentDTO,
    @Param('charName') char: string,
  ) {
    return this.talentService.create(body, char);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Access(AccessLevel.ADMIN)
  @Get(':charNameId')
  find(@Param('charNameId') char: string | number) {
    return this.talentService.find(char);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Access(AccessLevel.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.talentService.remove(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Access(AccessLevel.ADMIN)
  @Delete(':charName')
  removeAll(@Param('charName') charName: string) {
    return this.talentService.removeAll(charName);
  }
}
