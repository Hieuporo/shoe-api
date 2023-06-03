import {
  HttpException,
  HttpStatus,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/Register.dto';
import { UserService } from '../user/user.service';
import { LogInDto } from './dto/Login.dto';
import { Response, Request } from 'express';
import { CartService } from '../cart/cart.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly cartService: CartService,
  ) {}

  public async register(regiterData: RegisterDto) {
    const hashedPassword = await bcrypt.hash(regiterData.password, 10);

    try {
      const createdUser = await this.userService.createUser({
        ...regiterData,
        password: hashedPassword,
      });

      const userId = createdUser.id;
      await this.cartService.createNewCart({ userId });

      return createdUser;
    } catch (error) {
      if (error.code == 'P2002') {
        throw new ForbiddenException('User with this email already exists');
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async login(loginData: LogInDto, res: Response) {
    const user = await this.userService.getByEmail(loginData.email);

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    await this.verifyPassword(loginData.password, user.password);

    let role: string;

    role = 'user';

    if (user.isAdmin) {
      role = 'admin';
    }

    const token = await this.signToken({
      userId: user.id.toString(),
      email: user.email,
      role,
    });

    if (!token) {
      throw new ForbiddenException('Could not login');
    }

    res.cookie('token', token, {});
    user.password = undefined;

    return res.send({ message: 'Logged in succefully' });
  }

  private async verifyPassword(candidatePassword: string, password: string) {
    const isPasswordMatching = await bcrypt.compare(
      candidatePassword,
      password,
    );

    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async signToken(args: { userId: string; email: string; role: string }) {
    const payload = {
      id: args.userId,
      email: args.email,
      role: args.role,
    };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: '30d',
    });

    return token;
  }

  async signout(req: Request, res: Response) {
    res.clearCookie('token');

    return res.send({ message: 'Logged out succefully' });
  }
}
