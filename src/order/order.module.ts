import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ProductModule } from '../product/product.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [CartModule, ProductModule],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
