import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

@InputType()
export class CreateUserDto {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsStrongPassword()
  password: string;
}

@InputType()
export class LoginUserDto {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsStrongPassword()
  password: string;
}

@ObjectType()
export class AuthPayload {
  @Field()
  @IsString()
  token: string;
}
