import { Query, Resolver } from '@nestjs/graphql';
import { User } from './user.schema';
import { UserService } from './user.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [User], { name: 'users' })
  async findAll() {
    const { users } = await this.userService.findAll();
    return users;
  }

  @UseGuards(AuthGuard)
  @Query(() => User, { name: 'user' })
  async findUser(@GetUser('sub') userId: string) {
    const { user } = await this.userService.findById(userId);
    return user;
  }
}
