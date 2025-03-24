import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Files } from './entity/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Char } from '@char/entity/char.entity';
import { CustomRequest } from '@globals/interface/global.interface';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(Files) private readonly filesRepo: Repository<Files>,
    @InjectRepository(Char) private readonly charRepo: Repository<Char>,
  ) {}

  async addFile(fileData: {
    name: string;
    imageType: string;
    filename: string;
    path: string;
    req: CustomRequest;
  }) {
    if (fileData.req.login_status === false) throw new UnauthorizedException();
    const char = await this.charRepo.findOneBy({ name: fileData.name });
    if (char === null) {
      throw new BadRequestException(
        `The char named ${fileData.name} does not exists.`,
      );
    }

    const file = this.filesRepo.create({
      imageType: fileData.imageType,
      char,
      fileName: fileData.filename,
      filePath: fileData.path,
    });

    if (
      (await this.filesRepo.findOneBy({ fileName: fileData.filename })).id !==
      undefined
    )
      throw new BadRequestException(
        `This image already exists you should update.`,
      );

    await this.filesRepo.save(file);

    return {
      message: `File with name: ${fileData.name} was created and associated to Char: ${fileData.name}.`,
      filePath: fileData.path,
    };
  }
}
