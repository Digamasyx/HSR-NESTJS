import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { TalentService } from './talent.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Access } from 'src/roles/roles.decorators';
import { AccessLevel } from 'src/roles/roles.enum';
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
}
