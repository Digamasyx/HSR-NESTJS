import {
  Controller,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/globals/config/multer.config';
import { FileService } from './file.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Access } from 'src/roles/roles.decorators';
import { AccessLevel } from 'src/roles/roles.enum';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Access(AccessLevel.ADMIN)
  @Post('addFile/:name/:imageType')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  async addFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('name') name: string,
    @Param('imageType') imageType: string,
    @Req() req: any,
  ) {
    await this.fileService.addFile({
      name,
      imageType,
      filename: file.filename,
      path: file.path,
      req,
    });
  }
}
