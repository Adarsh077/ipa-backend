import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './auth.dto';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private salt = 10;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{ token: string }> {
    const { email, name, password } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, this.salt);

    const { user } = await this.userService.create(name, email, hashedPassword);

    const token = await this.jwtService.signAsync({ sub: user._id.toString() });

    return { token };
  }

  async login(loginUserDto: LoginUserDto): Promise<{ token: string }> {
    const { email, password } = loginUserDto;
    if (!email || !password) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const user = await this.userService.getPassword(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password!');
    }

    const token = await this.jwtService.signAsync({
      sub: user._id.toString(),
    });

    return { token };
  }
}
