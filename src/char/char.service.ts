import { BadRequestException, Injectable } from '@nestjs/common';
import { IChar } from './interface/char.interface';
import { CharDTO, UpdateCharDTO } from './dto/char.dto';
import { Repository } from 'typeorm';
import { Char } from './entity/char.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CharProvider } from './char.provider';

@Injectable()
export class CharService implements IChar {
  constructor(
    @InjectRepository(Char) private charRepo: Repository<Char>,
    private readonly charProvider: CharProvider,
  ) {}

  async create(body: CharDTO) {
    // ! Testar
    body.asc = (() =>
      typeof body.asc === 'undefined'
        ? this.charProvider.defineAsc(body.level)
        : body.asc)();
    for (const i of ['hp', 'atk', 'def']) {
      body[i] = this.charProvider.jsonArrayToString(body[i]) as string;
    }
    const char = this.charRepo.create(body as any);
    await this.charRepo.insert(char);
    return {
      message: `Char with name: ${body.name} was created.`,
    };
  }

  async find(name: string) {
    const char = await this.charRepo.findOneBy({ name });
    if (!char)
      throw new BadRequestException(
        `The char with specified name: ${name} does not exists.`,
      );
    return char;
  }

  async remove(name: string) {
    const char = await this.charRepo.findOneBy({ name });
    if (!char)
      throw new BadRequestException(
        `The char with name: ${name} does not exists.`,
      );
    await this.charRepo.remove(char);
    return { message: `The char with name: ${name} was removed.` };
  }

  // ! Testar
  async update(body: UpdateCharDTO, name: string) {
    let char = (await this.charRepo.findOneBy({ name })) as any;

    const properties = this.charProvider.nonNullProperties(body);

    properties.forEach((val) => {
      if (['atk', 'def', 'hp'].includes(val as string)) {
        char[val] = this.charProvider.stringToJsonArray(char[val]);
      }
    });

    if (!char) throw new BadRequestException();

    char = this.charProvider.changeProperties(properties, char, body);

    properties.forEach((val) => {
      if (['atk', 'def', 'hp'].includes(val as string)) {
        char[val] = this.charProvider.jsonArrayToString(char[val]);
      }
    });

    await this.charRepo.save(char);
  }
}
