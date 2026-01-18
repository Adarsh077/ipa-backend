import { Module } from '@nestjs/common';
import { InsuranceService } from './insurance.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Insurance, InsuranceSchema } from './insurances.schema';
import { InsuranceResolver } from './insurances.resolver';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Insurance.name, schema: InsuranceSchema },
    ]),
    UserModule,
  ],
  providers: [InsuranceService, InsuranceResolver],
})
export class InsurancesModule {}
