import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/createReview.dto';
import { Request } from 'express';

@Injectable()
export class ReviewService {
  constructor(private readonly prismaService: PrismaService) {}

  async createReview(review: CreateReviewDto, productId: string, req) {
    const user = req.user as {
      id: string;
      email: string;
      role: string;
    };

    const check = await this.prismaService.review.findFirst({
      where: {
        userId: user.id,
        productId,
      },
    });

    if (check) {
      console.log(check);
      const reviewAfterUpdate = await this.prismaService.review.update({
        where: {
          id: check.id,
        },
        data: {
          ...review,
        },
      });

      return reviewAfterUpdate;
    }

    const newReview = await this.prismaService.review.create({
      data: {
        ...review,
        userId: user.id,
        productId,
      },
    });

    if (!newReview) {
      throw new ForbiddenException('Something went wrong');
    }

    return newReview;
  }

  async getAllReviewsFromProduct(productId: string) {
    const product = await this.prismaService.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new NotFoundException('Product id not exists');
    }

    const reviews = await this.prismaService.review.findMany({
      where: {
        productId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reviews;
  }

  async deleteReview(reviewId: string, req) {
    const user = req.user as {
      id: string;
      email: string;
      role: string;
    };

    const isCurrentUserCreate = await this.prismaService.review.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!isCurrentUserCreate) {
      throw new ForbiddenException('You are not allowed to delete this review');
    }

    return this.prismaService.review.delete({
      where: {
        id: reviewId,
      },
    });
  }
}
