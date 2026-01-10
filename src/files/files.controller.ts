import { Body, Controller, Get, Put, Query } from '@nestjs/common';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private fileService: FilesService) {}

  @Put()
  async generateUploadSignedUrl(
    @Body('filename') filename: string,
  ): Promise<{ url: string }> {
    const url = await this.fileService.generateUploadSignedUrl(filename);
    return { url };
  }

  @Get()
  async generateReadSignedUrl(
    @Query('filename') filename: string,
  ): Promise<{ url: string }> {
    const url = await this.fileService.generateReadSignedUrl(filename);
    return { url };
  }
}
