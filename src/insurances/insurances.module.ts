import { Module } from '@nestjs/common';
import { InsurancesController } from './insurances.controller';
import { InsurancesService } from './insurances.service';

@Module({
  controllers: [InsurancesController],
  providers: [InsurancesService],
})
export class InsurancesModule {}
