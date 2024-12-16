import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Talent } from './entity/talent.entity';
import { Repository } from 'typeorm';
import { TalentDTO } from './dto/talent.dto';
import { Char } from 'src/char/entity/char.entity';

@Injectable()
export class TalentService {
  constructor(
    @InjectRepository(Talent) private talentRepo: Repository<Talent>,
    @InjectRepository(Char) private readonly charRepo: Repository<Char>,
  ) {}

  // ! Testar
  async create(body: TalentDTO, charName: string) {
    const char = await this.charRepo.findOneBy({ name: charName });
    const talent = this.talentRepo.create(body);
    talent.char = char;
    await this.talentRepo.save(talent);
    return {
      message: `Talent for 'char': ${char.name}, was created.`,
    };
  }
  // ! Testar
  async find(id_or_char: number | string) {
    let talent: Talent;
    if (typeof id_or_char === 'number') {
      talent = await this.talentRepo.findOneBy({ talent_id: id_or_char });
    } else {
      talent = await this.talentRepo.findOneBy({ char: { name: id_or_char } });
    }
    if (!talent)
      throw new BadRequestException(
        `Talent with ${typeof id_or_char === 'number' ? 'specified Id:' : 'associated Char:'} ${id_or_char} was not found.`,
      );
    return talent;
  }
  // ! Testar
  async remove(id: number) {
    const talent = await this.talentRepo.findOneBy({ talent_id: id });
    if (!talent)
      throw new BadRequestException(`Talent with Id: ${id}, does not exists.`);
    await this.talentRepo.remove(talent);
    return {
      message: `The talent associated with the Char: ${talent.char.name} was removed.`,
    };
  }
}
