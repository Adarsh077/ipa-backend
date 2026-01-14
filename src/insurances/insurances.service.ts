import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Insurance, InsuranceDocument } from './insurances.schema';
import { Model } from 'mongoose';
import { CreateInsuranceServiceDto } from './insurance.dto';
import { InsuranceStatus } from './insurance.enum';

@Injectable()
export class InsurancesService {
  constructor(
    @InjectModel(Insurance.name)
    private insuranceModel: Model<InsuranceDocument>,
  ) {}

  async create(data: CreateInsuranceServiceDto): Promise<Insurance> {
    const insurance = await this.insuranceModel.create({
      user: data.user,
      filename: data.filename,
      filepath: data.filepath,
      status: InsuranceStatus.Created,
    });

    return insurance;
  }

  async list(user: string): Promise<Insurance[]> {
    const insurances = await this.insuranceModel
      .find({ user })
      .select('filepath filename status');

    return insurances;
  }
}
