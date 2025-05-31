import { BadRequestException, Injectable } from '@nestjs/common';
// import { ILightCone } from './interface/light-cone.interface';
import { LcDTO } from './dto/light-cone.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LightCone } from './entity/light-cone.entity';
import { Repository } from 'typeorm';
import { Char } from '@char/entity/char.entity';
import { LightConeProvider } from './light-cone.provider';

@Injectable()
export class LightConeService /* implements ILightCone */ {
  constructor(
    @InjectRepository(LightCone) private readonly lcRepo: Repository<LightCone>,
    @InjectRepository(Char) private readonly charRepo: Repository<Char>,
    private readonly lcProvider: LightConeProvider,
  ) {}

  async create(body: LcDTO, charName: string): Promise<{ message: string }> {
    if (this.lcRepo.findOneBy({ name: body.name })) {
      throw new BadRequestException(
        `Light cone with name: ${body.name} already exists.`,
      );
    }

    const char = await this.charRepo.findOneBy({
      name: this.lcProvider.capitalize(charName),
    });
    if (!char) {
      throw new BadRequestException(
        `Char with name: ${this.lcProvider.capitalize(charName)} was not found.`,
      );
    }

    const lightcone = this.lcRepo.create(body);
    char.lightcone = lightcone;

    await this.lcRepo.save(lightcone);
    await this.charRepo.save(char);

    return {
      message: `Light cone with name: '${body.name}' With signaure char: '${char.name}'`,
    };
  }
}
