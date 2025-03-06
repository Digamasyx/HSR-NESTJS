import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Talent } from './entity/talent.entity';
import { Repository } from 'typeorm';
import { TalentDTO } from './dto/talent.dto';
import { Char } from 'src/char/entity/char.entity';
import { TalentProvider } from './talent.provider';
import { ITalent } from './interface/talent.interface';

@Injectable()
export class TalentService implements ITalent {
  constructor(
    @InjectRepository(Talent) private talentRepo: Repository<Talent>,
    @InjectRepository(Char) private readonly charRepo: Repository<Char>,
    private talentProvider: TalentProvider,
  ) {}

  // * Teoricamente tá Ok 👌
  async create(body: TalentDTO, charName: string) {
    const char = await this.charRepo.findOneBy({ name: charName });
    if (!char)
      throw new BadRequestException(
        `Char with name: ${charName} was not found.`,
      );
    this.talentProvider.checkBody(body);
    const talent = this.talentRepo.create(body);
    talent.char = char;
    await this.talentRepo.save(talent);
    return {
      message: `Talent for 'char': ${char.name}, was created.`,
    };
  }
  // ? Considero isso como ok 😐
  async find(id_or_char: string | number) {
    let talent: Talent | Talent[];
    if (this.talentProvider.isTrueNumber(id_or_char)) {
      id_or_char = Number(id_or_char);
      if (id_or_char < 1)
        throw new BadRequestException(
          'Only positive ID values can be inserted.',
        );
      talent = await this.talentRepo.findOneBy({ talent_id: id_or_char });
    } else {
      if (id_or_char.length === 0)
        throw new BadRequestException('Empty char name was inserted.');
      talent = await this.talentRepo.findBy({ char: { name: id_or_char } });
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

  // ! Testar
  async removeAll(charName: string) {
    const char = await this.charRepo.findOneBy({ name: charName });
    if (!char)
      throw new BadRequestException(
        `Char with name: ${charName} does not exists.`,
      );
    if (!char.talent)
      throw new BadRequestException(
        `This char does not have any talent assigned.`,
      );
    delete char.talent;

    await this.charRepo.save(char);

    return { message: `All talents from char: ${charName}, were removed.` };
    
  }
}
