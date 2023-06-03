import { IsString } from 'class-validator';

export class LogInDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}
