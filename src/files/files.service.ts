import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  private client: S3Client;

  constructor(private configService: ConfigService) {
    this.client = new S3Client({
      region: 'ap-south-1',
      credentials: {
        accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async generateUploadSignedUrl(filename: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.configService.getOrThrow('S3_BUCKET_NAME'),
      Key: filename,
      ContentType: 'application/pdf',
    });

    const url = await getSignedUrl(this.client, command, {
      expiresIn: 60 * 10,
    });

    return url;
  }

  async generateReadSignedUrl(filename: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.configService.getOrThrow('S3_BUCKET_NAME'),
      Key: filename,
    });

    const url = await getSignedUrl(this.client, command, {
      expiresIn: 60 * 10,
    });

    return url;
  }
}
