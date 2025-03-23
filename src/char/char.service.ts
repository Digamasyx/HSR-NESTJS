import { BadRequestException, Injectable } from '@nestjs/common';
import { IChar } from './interface/char.interface';
import { CharDTO, UpdateCharDTO } from './dto/char.dto';
import { Repository } from 'typeorm';
import { Char } from './entity/char.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CharProvider } from './char.provider';
import { Paths, Types } from './enums/char.enum';

@Injectable()
export class CharService implements IChar {
  constructor(
    @InjectRepository(Char) private charRepo: Repository<Char>,
    private readonly charProvider: CharProvider,
  ) {}

  async create(body: CharDTO) {
    // ! Testar depois com o validationPipe
    body.asc = (() =>
      typeof body.asc === 'undefined'
        ? this.charProvider.defineAsc(body.level)
        : body.asc)();
    for (const i of ['hp', 'atk', 'def']) {
      body[i] = this.charProvider.jsonArrayToString(body[i]) as string;
    }
    const charExists = await this.charRepo.findOneBy({ name: body.name });
    if (charExists) {
      throw new BadRequestException(
        `Duplicated char with name: ${body.name} was inserted.`,
      );
    }
    const char = this.charRepo.create(body as any);
    await this.charRepo.insert(char);
    return {
      message: `Char with name: ${body.name} was created.`,
    };
  }

  async find(arg: string): Promise<Char>;
  async find(arg: Paths | Types): Promise<Char[]>;
  async find(arg: string | Paths | Types): Promise<Char | Char[]> {
    let char: Promise<Char> | Promise<Char[]>;
    if (arg.length <= 0)
      throw new BadRequestException("The name field can't be empty.");

    if (this.charProvider.isPaths(arg))
      char = this.charRepo.findBy({ path: arg });
    else if (this.charProvider.isTypes(arg))
      char = this.charRepo.findBy({ type: arg });
    else
      char = this.charRepo.findOne({
        where: { name: arg },
        relations: { talent: true, files: true },
      });

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
    if (!char) throw new BadRequestException();

    const properties = this.charProvider.nonNullProperties(body);

    properties.forEach((val) => {
      if (['atk', 'def', 'hp'].includes(val as string)) {
        char[val] = this.charProvider.stringToJsonArray(char[val]);
      }
    });

    char = this.charProvider.changeProperties(properties, char, body);

    properties.forEach((val) => {
      if (['atk', 'def', 'hp'].includes(val as string)) {
        char[val] = this.charProvider.jsonArrayToString(char[val]);
      }
    });

    await this.charRepo.save(char);
  }
}
