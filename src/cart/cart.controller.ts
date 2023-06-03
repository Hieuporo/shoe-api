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
} from '@nestjs/common';
import JwtAuthenticationGuard from '../auth/guard/Jwt-authentication.guard';
import { CartService } from './cart.service';
import { plainToClass } from 'class-transformer';
import { CartItemDto } from './dto/cartItem.dto';

@Controller('cart')
@UseGuards(JwtAuthenticationGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post(':id')
  addProductToCart(
    @Body() product,
    @Param('id') productId: string,
    @Request() req,
  ) {
    return this.cartService.addProducttoCart(product, productId, req);
  }

  @Get('getAllCartItems')
  getAllCartItems(@Request() req) {
    return this.cartService.getAllCartItemsWithPrice(req);
  }

  @Patch(':id')
  updateCartItem(
    @Body() cartItem: CartItemDto,
    @Param('id') cartItemId,
    @Request() req,
  ) {
    const realCartItem = plainToClass(CartItemDto, cartItem, {
      excludeExtraneousValues: true,
    });

    return this.cartService.updateCartItem(realCartItem, cartItemId, req);
  }

  @Delete(':id')
  removeCartItem(@Param('id') cartItemId: string, @Request() req) {
    return this.cartService.deleteCartItem(cartItemId, req);
  }
}
