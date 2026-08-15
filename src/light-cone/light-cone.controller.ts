import {
  Body,
  Controller,
  Param,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { LightConeService } from './light-cone.service';
import { LcDTO } from './dto/light-cone.dto';
import { GlobalExceptionFilter } from '@globals/filter/globalException.filter';
import { AuthGuard } from '@auth/auth.guard';
import { RolesGuard } from '@roles/roles.guard';
import { Access } from '@roles/roles.decorators';
import { AccessLevel } from '@roles/roles.enum';

@ApiTags('Light Cone')
@UseFilters(GlobalExceptionFilter)
@Controller('light-cone')
export class LightConeController {
  constructor(private readonly lightConeService: LightConeService) {}

  @ApiOperation({
    summary: 'Criar cone de luz para personagem',
    tags: ['Light Cone', 'Create'],
  })
  @ApiBody({ type: LcDTO })
  @ApiParam({ name: 'sigChar', type: String, required: true })
  @UseGuards(AuthGuard, RolesGuard)
  @Access(AccessLevel.ADMIN)
  @Post(':sigChar')
  async create(@Body() body: LcDTO, @Param('sigChar') char: string) {
    return await this.lightConeService.create(body, char);
  }
}
