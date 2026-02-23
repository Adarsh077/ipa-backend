import { Field, InputType } from '@nestjs/graphql';
import {
  IsMongoId,
  IsString,
  IsDateString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { PolicyFrequency } from './insurance.enum';

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

@InputType()
export class UpdateInsuranceInfoDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  next_due_date?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  policy_holder_name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  policy_start_date?: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  premium_amount?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  last_premium_due_date?: Date;

  @Field(() => PolicyFrequency, { nullable: true })
  @IsOptional()
  @IsEnum(PolicyFrequency)
  policy_frequency?: PolicyFrequency;
}
