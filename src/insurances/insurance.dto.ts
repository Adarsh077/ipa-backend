import { IsMongoId, IsString } from 'class-validator';

export class CreateInsuranceDto {
  @IsString()
  filename: string;

  @IsString()
  filepath: string;
}

export class CreateInsuranceServiceDto extends CreateInsuranceDto {
  @IsMongoId()
  user: string;
}
