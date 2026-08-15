import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TalentService } from './talent.service';
import { AuthGuard } from '@auth/auth.guard';
import { RolesGuard } from '@roles/roles.guard';
import { Access } from '@roles/roles.decorators';
import { AccessLevel } from '@roles/roles.enum';
import { TalentDTO, UpdateTalentDTO } from './dto/talent.dto';
import { GlobalExceptionFilter } from '@globals/filter/globalException.filter';
import { ITalent } from './interface/talent.interface';

@ApiTags('Talent')
@UseFilters(GlobalExceptionFilter)
@Controller('talent')
export class TalentController implements ITalent {
  constructor(private readonly talentService: TalentService) {}

  @ApiOperation({
    summary: 'Criar talento para personagem',
    tags: ['Talent', 'Create'],
  })
  @ApiBody({ type: TalentDTO })
  @ApiParam({ name: 'charName', type: String, required: true })
  @UseGuards(AuthGuard, RolesGuard)
  @Access(AccessLevel.ADMIN)
  @Post(':charName')
  create(
    @Body(new ValidationPipe()) body: TalentDTO,
    @Param('charName') char: string,
  ) {
    return this.talentService.create(body, char);
  }

  @ApiOperation({
    summary: 'Buscar talento por personagem',
    tags: ['Talent', 'Read'],
  })
  @ApiParam({ name: 'charNameId', type: String, required: true })
  @Get(':charNameId')
  find(@Param('charNameId') char: string | number) {
    return this.talentService.find(char);
  }

  @ApiOperation({ summary: 'Remover talento', tags: ['Talent', 'Delete'] })
  @ApiParam({ name: 'id', type: Number, required: true })
  @UseGuards(AuthGuard, RolesGuard)
  @Access(AccessLevel.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.talentService.remove(id);
  }

  @ApiOperation({
    summary: 'Remover talentos por personagem',
    tags: ['Talent', 'Delete'],
  })
  @ApiParam({ name: 'charName', type: String, required: true })
  @UseGuards(AuthGuard, RolesGuard)
  @Access(AccessLevel.ADMIN)
  @Delete(':charName')
  removeAll(@Param('charName') charName: string) {
    return this.talentService.removeAll(charName);
  }

  @ApiOperation({ summary: 'Atualizar talento', tags: ['Talent', 'Update'] })
  @ApiBody({ type: UpdateTalentDTO })
  @ApiParam({ name: 'talent_id', type: Number, required: true })
  @UseGuards(AuthGuard, RolesGuard)
  @Access(AccessLevel.ADMIN)
  @Patch('update/:talent_id')
  @Header('Content-Type', 'text/plain')
  update(@Param('talent_id') id: number, @Body() body: UpdateTalentDTO) {
    return this.talentService.update(id, body);
  }
}
