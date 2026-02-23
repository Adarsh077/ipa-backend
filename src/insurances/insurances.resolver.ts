import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { InsuranceService } from './insurance.service';
import { Insurance } from './insurances.schema';
import type { InsuranceDocument } from './insurances.schema';
import { User } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { CreateInsuranceDto } from './insurance.dto';

@Resolver(() => Insurance)
@UseGuards(AuthGuard)
export class InsuranceResolver {
  constructor(
    private readonly insuranceService: InsuranceService,
    private readonly userService: UserService,
  ) {}

  private readonly logger = new Logger(InsuranceResolver.name);

  @Query(() => [Insurance], { name: 'insurance' })
  async findAll(@GetUser('sub') userId: string) {
    const insurances = await this.insuranceService.list(userId);
    return insurances;
  }

  @Mutation(() => Insurance)
  async createInsurance(
    @GetUser('sub') userId: string,
    @Args('createInsuranceInput') createInsuranceInput: CreateInsuranceDto,
  ) {
    const insurance = await this.insuranceService.create({
      ...createInsuranceInput,
      user: userId,
    });

    return insurance;
  }

  @ResolveField('user', () => User)
  async getUser(
    @Parent() insurance: InsuranceDocument,
  ): Promise<Partial<User>> {
    const { user } = await this.userService.findById(insurance.user.toString());
    return user;
  }
}
