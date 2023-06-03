import {
  NotFoundException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(user: CreateUserDto) {
    return this.prismaService.user.create({
      data: {
        ...user,
      },
      select: {
        id: true,
        email: true,
        number: true,
        firstName: true,
        lastName: true,
      },
    });
  }

  async getByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(updateUser: UpdateUserDto, req) {
    const user = req.user as {
      id: string;
      email: string;
      role: string;
    };

    const userAfterUpdate = await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: {
        ...updateUser,
      },
      select: {
        id: true,
        email: true,
        number: true,
        firstName: true,
        lastName: true,
      },
    });

    return userAfterUpdate;
  }

  async getUserInfo(req) {
    const user = req.user as {
      id: string;
      email: string;
      role: string;
    };

    try {
      const curUser = await this.prismaService.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          id: true,
          email: true,
          number: true,
          firstName: true,
          lastName: true,
        },
      });

      if (!curUser) {
        throw new BadRequestException('User not exist');
      }

      return curUser;
    } catch (error) {
      throw new BadRequestException('Something went wrong');
    }
  }
}
