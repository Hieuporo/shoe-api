import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto {
  @Expose()
  @IsString()
  @IsOptional()
  address: string;

  @Expose()
  @IsString()
  @IsOptional()
  shipping: string;
}
