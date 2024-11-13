import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Talent } from './entity/talent.entity';
import { Repository } from 'typeorm';
import { TalentDTO } from './dto/talent.dto';
import { CustomRequest } from 'src/globals/interface/global.interface';
import { Char } from 'src/char/entity/char.entity';

@Injectable()
export class TalentService {
  constructor(
    @InjectRepository(Talent) private talentRepo: Repository<Talent>,
    @InjectRepository(Char) private readonly charRepo: Repository<Char>,
  ) {}

  // ! Testar
  async create(body: TalentDTO, req: CustomRequest) {
    const char = await this.charRepo.findOneBy({ name: req.user.name });
    const talent = this.talentRepo.create(body);
    talent.char = char;
    await this.talentRepo.save(talent);
    return {
      message: `Talent for "char": ${char.name}, was created.`,
    };
  }
}
