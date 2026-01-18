import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { InsuranceStatus } from './insurance.enum';
import { User } from 'src/user/user.schema';
import { Field, ID, ObjectType } from '@nestjs/graphql';

export type InsuranceDocument = HydratedDocument<Insurance>;

@ObjectType()
@Schema({ timestamps: true })
export class Insurance {
  @Field(() => ID)
  _id: mongoose.Types.ObjectId;

  @Field(() => User)
  @Prop({ required: true, type: mongoose.Types.ObjectId, ref: User.name })
  user: mongoose.Types.ObjectId;

  @Field()
  @Prop({ required: true })
  filename: string;

  @Field()
  @Prop({ required: true, unique: true })
  filepath: string;

  @Field(() => InsuranceStatus)
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
