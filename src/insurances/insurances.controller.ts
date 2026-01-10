import { Controller, Get, Post } from '@nestjs/common';

@Controller('insurances')
export class InsurancesController {
  @Post()
  async create() {}

  @Get()
  async list() {}
}
