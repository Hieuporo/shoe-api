import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartItemDto } from './dto/cartItem.dto';

@Injectable()
export class CartService {
  constructor(private readonly prismaService: PrismaService) {}

  checkUserHasCart(userId: string) {
    return this.prismaService.cart.findFirst({
      where: {
        userId: userId,
      },
    });
  }

  createNewCart(userId) {
    return this.prismaService.cart.create({
      data: {
        ...userId,
      },
    });
  }

  async addProducttoCart(product, productId: string, req) {
    const user = req.user as {
      id: string;
      email: string;
      name: string;
    };

    const cart = await this.checkUserHasCart(user.id);

    if (!cart) {
      throw new ForbiddenException('Cart not found');
    }

    const itIsAlreadyIn = await this.prismaService.cart.findFirst({
      where: {
        userId: user.id,
        items: {
          some: {
            productId,
          },
        },
      },
    });

    if (itIsAlreadyIn) {
      throw new ForbiddenException('Product already in cart');
    }

    const productToCheck = await this.prismaService.product.findFirst({
      where: {
        id: productId,
      },
    });

    await this.prismaService.cartItem.create({
      data: {
        ...product,
        productId,
        cartId: cart.id,
      },
    });

    return cart;
  }

  async getAllCartItemsWithPrice(req) {
    const user = req.user as {
      id: string;
      email: string;
      role: string;
    };

    const cart = await this.prismaService.cart.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!cart) {
      throw new ForbiddenException('Cart not found');
    }

    let cartItems = await this.prismaService.cartItem.findMany({
      where: {
        cartId: cart.id,
      },
    });

    const result = [];

    for (const item of cartItems) {
      const product = await this.prismaService.product.findUnique({
        where: {
          id: item.productId,
        },
      });

      const newItem = {
        image: product.image,
        price: product.price,
        discount: product.discount,
        ...item,
      };

      result.push(newItem);
    }

    return result;
  }

  async updateCartItem(cartItem: CartItemDto, cartItemId: string, req) {
    const user = req.user as {
      id: string;
      email: string;
      role: string;
    };

    const cart = await this.prismaService.cart.findFirst({
      where: {
        userId: user.id,
        items: {
          some: {
            id: cartItemId,
          },
        },
      },
    });

    if (!cart) {
      throw new ForbiddenException('CartItem not found');
    }

    const product = await this.prismaService.product.findFirst({
      where: {
        cartItems: {
          some: {
            id: cartItemId,
          },
        },
      },
    });

    if (product.quantity < cartItem.quantity) {
      throw new ForbiddenException('Product quantity is not enough');
    }

    const newCartItem = await this.prismaService.cartItem.update({
      where: {
        id: cartItemId,
      },
      data: {
        ...cartItem,
      },
    });

    return newCartItem;
  }

  async deleteCartItem(cartItemId, req) {
    return await this.prismaService.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });
  }
}
