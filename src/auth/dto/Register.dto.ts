import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @Expose()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  number: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  password: string;
}
