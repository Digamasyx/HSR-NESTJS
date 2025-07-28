import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    const charQr = this.charRepo.createQueryBuilder('char');

    if (arg.length <= 0)
      throw new BadRequestException("The name field can't be empty.");

    if (this.charProvider.isPaths(arg)) {
      charQr.where('char.path = :path', { path: arg });
    } else if (this.charProvider.isTypes(arg)) {
      charQr.where('char.type = :type', { type: arg });
    } else {
      charQr
        .where('char.name = :name', { name: arg })
        .leftJoinAndSelect('char.talent', 'talent')
        .leftJoinAndSelect('char.files', 'files');
    }

    const total = await charQr.getCount();

    if (!total) {
      if (this.charProvider.isPaths(arg))
        throw new BadRequestException(
          `There are 0 chars for this path: ${arg}.`,
        );
      else if (this.charProvider.isTypes(arg))
        throw new BadRequestException(
          `There are 0 chars for this type: ${arg}.`,
        );
      else
        throw new BadRequestException(
          `The char with specified name: ${arg} does not exists.`,
        );
    }
    return total > 1 ? charQr.getMany() : charQr.getOne();
  }

  async findAll(page: number, limit: number): Promise<Char[]> {
    const [chars, total] = await this.charRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    if (!total) throw new NotFoundException('There are no characters saved.');
    return chars;
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
