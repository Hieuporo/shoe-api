import { IsNumber, IsString, IsInt, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsNumber()
  @IsOptional()
  price: number;

  @IsNumber()
  @IsOptional()
  discount: number;

  @IsString()
  @IsOptional()
  name: string;

  @IsInt()
  @IsOptional()
  quantity: number;

  @IsString()
  @IsOptional()
  brand: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  image: string;
}
