import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  @Expose()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Expose()
  number: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Expose()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @Expose()
  lastName: string;
}
