import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { FilesResolver } from './files.resolver';

@Module({
  controllers: [FilesController],
  providers: [FilesService, FilesResolver],
})
export class FilesModule {}
