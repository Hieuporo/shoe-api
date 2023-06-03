import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  Request,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/createReview.dto';
import JwtAuthenticationGuard from '../auth/guard/Jwt-authentication.guard';
import { ReviewService } from './review.service';

@Controller('review')
@UseGuards(JwtAuthenticationGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post(':id')
  createReview(
    @Param('id') productId: string,
    @Body() review: CreateReviewDto,
    @Request() req,
  ) {
    return this.reviewService.createReview(review, productId, req);
  }

  @Get(':id')
  getAllReviewsFromProduct(@Param('id') productId: string) {
    return this.reviewService.getAllReviewsFromProduct(productId);
  }

  @Delete(':id')
  deleteReview(@Param('id') reviewId: string, @Request() req) {
    return this.reviewService.deleteReview(reviewId, req);
  }
}
