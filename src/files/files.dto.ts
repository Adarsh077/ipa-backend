import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class FileSignedUrlDto {
  @Field()
  @IsString()
  filepath: string;
}

@ObjectType()
export class FileSignedUrlPayload {
  @Field()
  @IsString()
  url: string;
}
