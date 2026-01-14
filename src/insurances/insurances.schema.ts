import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { InsuranceStatus } from './insurance.enum';
import { User } from 'src/user/user.schema';

export type InsuranceDocument = HydratedDocument<Insurance>;

@Schema({ timestamps: true })
export class Insurance {
  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: User.name })
  user: mongoose.Types.ObjectId;

  @Prop({ required: true })
  filename: string;

  @Prop({ required: true, unique: true })
  filepath: string;

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

export const InsuranceSchema = SchemaFactory.createForClass(Insurance);
