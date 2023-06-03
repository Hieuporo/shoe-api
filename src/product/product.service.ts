import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProductDto } from './dto/createProduct.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(productInfo: ProductDto) {
    const newProduct = await this.prismaService.product.create({
      data: {
        ...productInfo,
      },
    });

    if (!newProduct) {
      throw new ForbiddenException('Something went wrong, please try again');
    }

    return newProduct;
  }

  async getAllProducts() {
    const products = await this.prismaService.product.findMany({
      include: {
        review: true,
      },
    });

    const productsWithAverageStar = products.map((product) => {
      const reviews = product.review;
      const totalStars = reviews.reduce((acc, review) => acc + review.star, 0);
      const averageStar = reviews.length > 0 ? totalStars / reviews.length : 0;

      return {
        ...product,
        averageStar,
      };
    });

    return productsWithAverageStar;
  }

  async searchProductByBrandAndPrice(data) {
    const { min, max, brand, name } = data;
    let query;
    if (min && max) {
      query = {
        price: {
          gte: parseFloat(min),
          lte: parseFloat(max),
        },
      };
    }

    if (brand) {
      query = {
        ...query,
        brand,
      };
    }

    if (name) {
      query = {
        ...query,
        name: {
          contains: name,
          mode: 'insensitive', // Tìm kiếm không phân biệt chữ hoa chữ thường
        },
      };
    }

    const products = await this.prismaService.product.findMany({
      where: query,
    });

    return products;
  }

  async getProductById(id: string) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id,
      },
      include: {
        review: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const reviews = product.review;
    const totalStars = reviews.reduce((acc, review) => acc + review.star, 0);
    const averageStar = reviews.length > 0 ? totalStars / reviews.length : 0;
    return { ...product, averageStar };
  }

  async updateProduct(id: string, productInfo: UpdateProductDto) {
    try {
      return await this.prismaService.product.update({
        where: { id },
        data: {
          ...productInfo,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Record to update not found');
      }
      throw new ForbiddenException('Something went wrong, please try again');
    }
  }

  async deleteProduct(id: string) {
    try {
      return await this.prismaService.product.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Record to delete not found');
      }
      throw new ForbiddenException('Something went wrong, please try again');
    }
  }

  async getFourProducts(currentProductId) {
    const products = await this.prismaService.product.findMany({
      take: 4,
      where: {
        id: {
          not: currentProductId,
        },
      },
      include: {
        review: true,
      },
    });
    const productsWithAverageStar = products.map((product) => {
      const reviews = product.review;
      const totalStars = reviews.reduce((acc, review) => acc + review.star, 0);
      const averageStar = reviews.length > 0 ? totalStars / reviews.length : 0;

      return {
        ...product,
        averageStar,
      };
    });

    return productsWithAverageStar;
  }

  async createMultipleProduct() {
    const newProducts = await this.prismaService.product.createMany({
      data: [
        {
          price: 140,
          name: 'Air Jordan Low SE',
          brand: 'Nike',
          quantity: 132,
          image:
            'http://res.cloudinary.com/dalqfcdow/image/upload/v1684219943/z9zq3rkn0ouo7nvwgb5f.jpg',
          description:
            'Get into some summery fun in your new fave AJ1s. Made with a combination of suede and canvas, this pair gives you the comfort you know and love with a seasonal update.',
        },
        {
          price: 120,
          name: 'Nike Air Force 1',
          brand: 'Nike',
          quantity: 132,
          image:
            'https://res.cloudinary.com/dalqfcdow/image/upload/v1684221612/hicltlmrynpcttpobpok.webp',
          description:
            "The radiance lives on in the Nike Air Force 1 '07, the basketball original that puts a fresh spin on what you know best: durably stitched overlays, clean finishes and the perfect amount of flash to make you shine.",
        },
        {
          price: 300,
          name: 'Nike Air Max Pulse',
          brand: 'Nike',
          quantity: 132,
          image:
            'http://res.cloudinary.com/dalqfcdow/image/upload/v1684221663/da7pgpogj8ezxgfa6scn.webp',
          description:
            "Keeping it real, the Air Max Pulse pulls inspiration from the London music scene, bringing an underground touch to the iconic Air Max line. Its textile-wrapped midsole and vacuum-sealed accents keep 'em looking fresh and clean, while colours inspired by the London music scene give your look the edge. Point-loaded Air cushioning—revamped from the incredibly plush Air Max 270—delivers better bounce, helping you push past your limits.",
        },

        {
          price: 150,
          name: "Nike Blazer Low '77 Vintage",
          brand: 'Nike',
          quantity: 132,
          image:
            'http://res.cloudinary.com/dalqfcdow/image/upload/v1684221697/nbuvequ7kns1lv1pdiut.webp',
          description:
            "Praised for its classic simplicity and comfort, the original hoops look is your tried-and-tested wardrobe staple. With a low-profile design and a plush collar, it's your no-brainer.",
        },
        {
          price: 300,
          name: 'Nike Dunk High Retro Premium',
          brand: 'Nike',
          quantity: 132,
          image:
            'http://res.cloudinary.com/dalqfcdow/image/upload/v1684221740/lghn3jfbppxp2qjasylv.webp',
          description:
            '50 years after the birth of the genre, hip-hop is still influencing streetwear. Nike shoes have always been an integral part of this culture, both influencing and being influenced by iconic musicians, artists and fans. Celebrate half a century of art and culture with platinum details like a microphone charm. Lace up and get spinning.',
        },
        {
          price: 122,
          name: 'Nike Dunk Low Retro Premium',
          brand: 'Nike',
          quantity: 132,
          image:
            'http://res.cloudinary.com/dalqfcdow/image/upload/v1684221782/wtvvda8xrpktj1h3qdyy.webp',
          description:
            "Created for the hardwood but taken to the streets, the '80s b-ball icon returns with premium materials that take your style to the next level. Its padded, low-cut collar lets you take your game anywhere—in comfort.",
        },
        {
          price: 300,
          name: 'Nike Pegasus 40 SE',
          brand: 'Nike',
          quantity: 132,
          image:
            'http://res.cloudinary.com/dalqfcdow/image/upload/v1684221806/zndombwqw7bsjhmkhrcw.webp',
          description:
            "A springy ride for every run, the Peg's familiar, just-for-you feel returns to help you accomplish your goals. This version has the same responsiveness and neutral support you love but with improved comfort in those sensitive areas of your foot, like the arch and toes. Whether you're logging long marathon miles, squeezing in a speed session before the sun goes down or hopping into a spontaneous group jaunt, it's still the established road runner you can put your faith in, day after day, run after run. Sharp, bright hues complement dark-room-colour neutrals, speaking to an inclusive world where digital and physical coexist in harmony.",
        },
        {
          price: 170,
          name: 'Air Jordan 1 Low FlyEase',
          brand: 'Nike',
          quantity: 132,
          image:
            'http://res.cloudinary.com/dalqfcdow/image/upload/v1684221829/vgw072w4ogdvuds6xkjs.webp',
          description:
            'Lock in your style with this AJ1. We kept everything you love about the classic design—premium leather, Air cushioning, iconic Wings logo—while adding the Nike FlyEase closure system to make on and off a breeze. Getting out the door is now quicker than ever: just strap and zip.',
        },
      ],
    });
    return newProducts;
  }
}
