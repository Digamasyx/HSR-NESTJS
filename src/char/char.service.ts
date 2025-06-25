import { BadRequestException, Injectable } from '@nestjs/common';
import { IChar } from './interface/char.interface';
import { CharDTO, UpdateCharDTO } from './dto/char.dto';
import { Repository } from 'typeorm';
import { Char } from './entity/char.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CharProvider } from './char.provider';
import { Paths, Types } from './enums/char.enum';
import { GlobalProvider } from '@globals/provider/global.provider';

@Injectable()
export class CharService implements IChar {
  constructor(
    @InjectRepository(Char) private charRepo: Repository<Char>,
    private readonly charProvider: CharProvider,
    private readonly globalProvider: GlobalProvider,
  ) {}

  async create(body: CharDTO) {
    // ! Testar depois com o validationPipe
    body.asc = (() =>
      typeof body.asc === 'undefined'
        ? this.charProvider.defineAsc(body.level)
        : body.asc)();

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

    if (this.charProvider.isPaths(arg)) {
      char = this.charRepo.findBy({ path: arg });
      if (!(await char))
        throw new BadRequestException(
          `There are 0 chars for this path: ${arg}.`,
        );
    } else if (this.charProvider.isTypes(arg)) {
      char = this.charRepo.findBy({ type: arg });
      if (!(await char))
        throw new BadRequestException(
          `There are 0 chars for this type: ${arg}.`,
        );
    } else
      char = this.charRepo.findOne({
        where: { name: arg },
        relations: { talent: true, files: true },
      });

    if (!(await char))
      throw new BadRequestException(
        `The char with specified name: ${arg} does not exists.`,
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

  async update(body: UpdateCharDTO, name: string) {
    const char = await this.charRepo.findOneBy({ name });
    if (!char)
      throw new BadRequestException(`Char with name ${name} does not exists.`);

    const allowedProperties: any = [
      'name',
      'level',
      'asc',
      'atk',
      'def',
      'hp',
      'spd',
      'path',
      'type',
    ] as const;

    const { changes, alterOrigin } = this.globalProvider.updateAssign(
      body,
      char,
      allowedProperties,
    );

    if (Object.keys(alterOrigin).length > 0) {
      Object.assign(char, alterOrigin);
      await this.charRepo.save(char);
    }

    let message = `Char ${char.name} updated.`;
    if (changes.length > 0) {
      const changeList = changes.map((c) => `${c.prop}: ${c.from} -> ${c.to}`);
      message += `\nChanges:\n ${changeList.join('\n- ')}`;
    } else {
      message += '\nNo changes were made.';
    }

    return message;
  }
}
