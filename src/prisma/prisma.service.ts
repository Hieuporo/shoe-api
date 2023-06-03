import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get('DATABASE_URL'),
        },
      },
    });
    console.log(configService.get('DATABASE_URL'));
  }
  cleanDatabase() {
    return this.$transaction([
      this.order.deleteMany(),
      this.user.deleteMany(),
      this.product.deleteMany(),
      this.orderItem.deleteMany(),
      this.review.deleteMany(),
      this.cart.deleteMany(),
      this.cartItem.deleteMany(),
    ]);
  }
}
