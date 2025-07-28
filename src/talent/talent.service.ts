import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Talent } from './entity/talent.entity';
import { Repository } from 'typeorm';
import { TalentDTO, UpdateTalentDTO } from './dto/talent.dto';
import { Char } from '@char/entity/char.entity';
import { TalentProvider } from './talent.provider';
import { ITalent } from './interface/talent.interface';
import { GlobalProvider } from '@globals/provider/global.provider';

// ! Falta o update
@Injectable()
export class TalentService implements ITalent {
  constructor(
    @InjectRepository(Talent) private talentRepo: Repository<Talent>,
    @InjectRepository(Char) private readonly charRepo: Repository<Char>,
    private readonly talentProvider: TalentProvider,
    private readonly globalProvider: GlobalProvider,
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
    const talentQr = this.talentRepo.createQueryBuilder('talent');
    id_or_char = this.talentProvider.isTrueNumber(id_or_char)
      ? Number(id_or_char)
      : id_or_char;
    if (typeof id_or_char === 'number') {
      if (id_or_char < 1)
        throw new BadRequestException(
          'Only positive ID values can be inserted.',
        );
      talentQr.where('talent.id = :talent_id', { talent_id: id_or_char });
    } else {
      if (id_or_char.length === 0)
        throw new BadRequestException('Empty char name was inserted.');
      talentQr
        .innerJoin('talent.char', 'char')
        .where('char.name = :charName', { charName: id_or_char });
    }
    const result =
      typeof id_or_char === 'number'
        ? await talentQr.getOne()
        : await talentQr.getMany();
    if (!result || (Array.isArray(result) && result.length === 0))
      throw new BadRequestException(
        `Talent with ${typeof id_or_char === 'number' ? 'specified Id:' : 'associated Char:'} ${id_or_char} was not found.`,
      );
    return result;
  }

  async remove(id: number) {
    const talent = await this.talentRepo.findOneBy({ talent_id: id });
    if (!talent)
      throw new BadRequestException(`Talent with Id: ${id}, does not exists.`);
    await this.talentRepo.remove(talent);
    return {
      message: `The talent associated with the Char: ${talent.char.name} was removed.`,
    };
  }

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

  async update(talent_id: number, updateDTO: UpdateTalentDTO): Promise<string> {
    if (!this.talentProvider.isTrueNumber(talent_id)) {
      throw new BadRequestException('Invalid talent ID format');
    }

    const talent = await this.talentRepo.findOneBy({ talent_id });
    if (!talent) {
      throw new NotFoundException(`Talent with ID ${talent_id} not found`);
    }

    const allowedProperties = ['effect', 'stat', 'value', 'multiplicative'];

    const { changes, alterOrigin } = this.globalProvider.updateAssign(
      updateDTO,
      talent,
      allowedProperties,
    );

    if (Object.keys(alterOrigin).length > 0) {
      Object.assign(talent, alterOrigin);
      await this.talentRepo.save(talent);
    }

    let message = `Talent ${talent_id} updated.`;
    if (changes.length > 0) {
      const changeList = changes.map((c) => `${c.prop}: ${c.from} -> ${c.to}`);
      message += `\nChanges:\n- ${changeList.join('\n- ')}`;
    } else {
      message += '\nNo changes detected.';
    }
    return message;
  }
}
