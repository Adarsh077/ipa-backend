import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Insurance, InsuranceDocument } from './insurances.schema';
import mongoose, { Model } from 'mongoose';
import { CreateInsuranceServiceDto } from './insurance.dto';
import { InsuranceStatus } from './insurance.enum';
import { InsuranceParserService } from './insurance-parser.service';

@Injectable()
export class InsuranceService {
  constructor(
    @InjectModel(Insurance.name)
    private insuranceModel: Model<InsuranceDocument>,
    @Inject(forwardRef(() => InsuranceParserService))
    private insuranceParserService: InsuranceParserService,
  ) {}

  async create(data: CreateInsuranceServiceDto): Promise<Insurance> {
    const insurance = await this.insuranceModel.create({
      user: data.user,
      filename: data.filename,
      filepath: data.filepath,
      status: InsuranceStatus.Created,
    });

    this.insuranceParserService.parse(insurance._id).catch((error) => {
      console.error('Failed to parse insurance:', error);
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
      .select(
        'filepath filename status user next_due_date policy_holder_name policy_start_date premium_amount last_premium_due_date policy_frequency',
      );

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

  async findByIdAndUpdate(
    id: mongoose.Types.ObjectId,
    data: Partial<Insurance>,
  ): Promise<Insurance | null> {
    return await this.insuranceModel.findByIdAndUpdate(id, data, { new: true });
  }
}
