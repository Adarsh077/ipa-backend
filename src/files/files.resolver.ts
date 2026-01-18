import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FilesService } from './files.service';
import { FileSignedUrlDto, FileSignedUrlPayload } from './files.dto';

@Resolver()
export class FilesResolver {
  constructor(private readonly fileService: FilesService) {}

  @Mutation(() => FileSignedUrlPayload)
  async generateUploadSignedUrl(@Args('data') data: FileSignedUrlDto) {
    const url = await this.fileService.generateUploadSignedUrl(data.filepath);
    return { url };
  }

  @Mutation(() => FileSignedUrlPayload)
  async generateReadSignedUrl(@Args('data') data: FileSignedUrlDto) {
    const url = await this.fileService.generateReadSignedUrl(data.filepath);
    return { url };
  }
}
