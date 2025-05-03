import {
  Controller,
  Param,
  Post,
  Req,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '@globals/config/multer.config';
import { FileService } from './file.service';
import { AuthGuard } from '@auth/auth.guard';
import { RolesGuard } from '@roles/roles.guard';
import { Access } from '@roles/roles.decorators';
import { AccessLevel } from '@roles/roles.enum';
import { GlobalExceptionFilter } from '@globals/filter/globalException.filter';

@UseFilters(GlobalExceptionFilter)
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
