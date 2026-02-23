import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InsuranceService } from './insurance.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Insurance, InsuranceSchema } from './insurances.schema';
import { InsuranceResolver } from './insurances.resolver';
import { UserModule } from 'src/user/user.module';
import { InsuranceParserService } from './insurance-parser.service';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Insurance.name, schema: InsuranceSchema },
    ]),
    UserModule,
    ConfigModule,
    FilesModule,
  ],
  providers: [InsuranceService, InsuranceResolver, InsuranceParserService],
})
export class InsurancesModule {}
