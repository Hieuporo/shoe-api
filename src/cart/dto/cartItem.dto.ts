import { Expose } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class CartItemDto {
  @IsNumber()
  @IsOptional()
  @Expose()
  quantity: number;
}
