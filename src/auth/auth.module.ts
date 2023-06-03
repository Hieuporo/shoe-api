import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { CartModule } from '../cart/cart.module';
@Module({
  imports: [PrismaModule, UserModule, JwtModule, CartModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
