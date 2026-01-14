import { Module } from '@nestjs/common';
import { InsurancesController } from './insurances.controller';
import { InsurancesService } from './insurances.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Insurance, InsuranceSchema } from './insurances.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Insurance.name, schema: InsuranceSchema },
    ]),
  ],
  controllers: [InsurancesController],
  providers: [InsurancesService],
})
export class InsurancesModule {}
