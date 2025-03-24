import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import {
  CharSharedModule,
  FilesSharedModule,
} from '@globals/module/sharedEntity.module';
import { FileController } from './file.controller';

@Module({
  imports: [FilesSharedModule, CharSharedModule],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
