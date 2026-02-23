import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { InsuranceStatus, PolicyFrequency } from './insurance.enum';
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
      InsuranceStatus.Failed,
    ],
  })
  status: InsuranceStatus;

  @Field({ nullable: true })
  @Prop({ required: false, type: Date })
  next_due_date?: Date;

  @Field({ nullable: true })
  @Prop({ required: false })
  policy_holder_name?: string;

  @Field({ nullable: true })
  @Prop({ required: false, type: Date })
  policy_start_date?: Date;

  @Field({ nullable: true })
  @Prop({ required: false })
  premium_amount?: string;

  @Field({ nullable: true })
  @Prop({ required: false, type: Date })
  last_premium_due_date?: Date;

  @Field(() => PolicyFrequency, { nullable: true })
  @Prop({
    required: false,
    type: String,
    enum: [PolicyFrequency.Monthly, PolicyFrequency.Yearly],
  })
  policy_frequency?: PolicyFrequency;
}

export const InsuranceSchema = SchemaFactory.createForClass(Insurance);
