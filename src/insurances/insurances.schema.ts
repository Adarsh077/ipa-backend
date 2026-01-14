import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { InsuranceStatus } from './insurance.enum';

export type InsuranceDocument = HydratedDocument<Insurance>;

@Schema()
export class Insurance {
  @Prop({ required: true })
  filename: string;

  @Prop({
    required: true,
    type: String,
    enum: [
      InsuranceStatus.Created,
      InsuranceStatus.Processing,
      InsuranceStatus.Processed,
    ],
  })
  status: InsuranceStatus;
}
