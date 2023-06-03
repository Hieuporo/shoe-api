import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import JwtAuthenticationGuard from '../auth/guard/Jwt-authentication.guard';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { plainToClass } from 'class-transformer';
import { UpdateOrderDto } from './dto/updateOrder.dto';
import { RoleCheckInterceptor } from '../interceptor/checkrole';

@Controller('order')
@UseGuards(JwtAuthenticationGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('createOrder')
  createOrder(@Body() order: CreateOrderDto, @Request() req) {
    const realOrder = plainToClass(CreateOrderDto, order, {
      excludeExtraneousValues: true,
    });

    return this.orderService.createOrder(realOrder, req);
  }

  @Patch('updateOrder/:id')
  updateOrder(
    @Body() order: UpdateOrderDto,
    @Request() req,
    @Param('id') id: string,
  ) {
    const realOrder = plainToClass(UpdateOrderDto, order, {
      excludeExtraneousValues: true,
    });

    return this.orderService.updateOrderInfo(realOrder, req, id);
  }

  @Delete('removeOrder/:id')
  removeOrder(@Param('id') id: string, @Request() req) {
    return this.orderService.removeOrder(id, req);
  }

  @Get('getAllOrders')
  getAllOrders(@Request() req) {
    return this.orderService.getAllOrders(req);
  }

  // admin
  @Get('getProductsByStatus')
  @UseInterceptors(RoleCheckInterceptor)
  getPendingProducts() {
    return this.orderService.getProductsByStatus();
  }

  @Patch('changeProductStatus/:id')
  @UseInterceptors(RoleCheckInterceptor)
  changeProductStatus(@Body() body, @Param('id') id: string) {
    return this.orderService.changeProductStatus(body, id);
  }

  @Patch('confirmOrder/:id')
  @UseInterceptors(RoleCheckInterceptor)
  confirmOrder(@Param('id') id: string) {
    return this.orderService.confirmOrder(id);
  }

  @Patch('rejectOrder/:id')
  @UseInterceptors(RoleCheckInterceptor)
  rejectOrder(@Param('id') id: string) {
    return this.orderService.rejectOrder(id);
  }
}
