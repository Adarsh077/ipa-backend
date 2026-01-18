import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateInsuranceDto } from './insurance.dto';
import { Insurance } from './insurances.schema';
import { InsuranceService } from './insurance.service';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('insurances')
@UseGuards(AuthGuard)
export class InsurancesController {
  constructor(private insurancesService: InsuranceService) {}

  @Post()
  async create(
    @GetUser('sub') userId: string,
    @Body() data: CreateInsuranceDto,
  ): Promise<Insurance> {
    const insurance = this.insurancesService.create({
      ...data,
      user: userId,
    });
    return insurance;
  }

  @Get()
  async list(@GetUser('sub') userId: string): Promise<Insurance[]> {
    const insurances = await this.insurancesService.list(userId);

    return insurances;
  }
}
