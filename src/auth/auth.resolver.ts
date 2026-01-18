import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { AuthPayload, CreateUserDto, LoginUserDto } from './auth.dto';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async register(@Args('data') createUserDto: CreateUserDto) {
    const { token } = await this.authService.register(createUserDto);
    return { token };
  }

  @Mutation(() => AuthPayload)
  async login(@Args('data') loginUserDto: LoginUserDto) {
    const { token } = await this.authService.login(loginUserDto);
    return { token };
  }
}
