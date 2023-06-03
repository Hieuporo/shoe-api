// create-review.dto.ts

import { Expose } from 'class-transformer';
import { IsInt, IsString, Length, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @Expose()
  @IsInt()
  @Min(1)
  @Max(5)
  star: number;

  @Expose()
  @IsString()
  @Length(1, 255)
  content: string;
}
