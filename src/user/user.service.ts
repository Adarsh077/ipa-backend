import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(name: string, email: string, password: string) {
    const user = await this.userModel.create({
      email,
      name,
      password,
    });

    return { user };
  }

  async getPassword(email: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email }).select('password');

    return user;
  }

  async findOne(email: string): Promise<{ user: UserDocument }> {
    const user = await this.userModel.findOne({ email }).select('name email');

    if (!user) {
      throw new UnauthorizedException('User Not found');
    }

    return { user };
  }

  async findAll(): Promise<{ users: UserDocument[] }> {
    const users = await this.userModel.find().select('name email');

    return { users };
  }

  async findById(userId: string): Promise<{ user: UserDocument }> {
    const user = await this.userModel.findById(userId).select('name email');

    if (!user) {
      throw new HttpException('user not found!', HttpStatus.BAD_REQUEST);
    }

    return { user };
  }
}
