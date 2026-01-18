import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId, IsString } from 'class-validator';

@InputType()
export class CreateInsuranceDto {
  @Field()
  @IsString()
  filename: string;

  @Field()
  @IsString()
  filepath: string;
}

@InputType()
export class CreateInsuranceServiceDto extends CreateInsuranceDto {
  @Field()
  @IsMongoId()
  user: string;
}
