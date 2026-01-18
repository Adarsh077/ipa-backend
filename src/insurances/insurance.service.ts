import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Insurance, InsuranceDocument } from './insurances.schema';
import { Model } from 'mongoose';
import { CreateInsuranceServiceDto } from './insurance.dto';
import { InsuranceStatus } from './insurance.enum';

@Injectable()
export class InsuranceService {
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

  async list(user?: string): Promise<Insurance[]> {
    const query = {};
    if (user) {
      query['user'] = user;
    }

    const insurances = await this.insuranceModel
      .find(query)
      .select('filepath filename status user');

    return insurances;
  }

  async findById(id: string): Promise<Insurance> {
    const insurance = await this.insuranceModel
      .findById(id)
      .select('filepath filename status user');

    if (!insurance) {
      throw new HttpException('user not found!', HttpStatus.BAD_REQUEST);
    }

    return insurance;
  }
}
