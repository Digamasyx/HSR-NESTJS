import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import {
  CharSharedModule,
  FilesSharedModule,
} from '@globals/module/sharedEntity.module';
import { FileController } from './file.controller';
import { GlobalProvider } from '@globals/provider/global.provider';

@Module({
  imports: [FilesSharedModule, CharSharedModule],
  providers: [FileService, GlobalProvider],
  controllers: [FileController],
})
export class FileModule {}
