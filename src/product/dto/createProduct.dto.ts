import {
  IsNumber,
  IsString,
  IsInt,
  IsOptional,
  IsDecimal,
} from 'class-validator';

export class ProductDto {
  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  discount: number;

  @IsString()
  name: string;

  @IsInt()
  quantity: number;

  @IsString()
  brand: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsString()
  image: string;
}
