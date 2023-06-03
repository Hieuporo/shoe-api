import { Body, Controller, Get, Post, Response, Request } from '@nestjs/common';
import { RegisterDto } from './dto/Register.dto';
import { AuthService } from './auth.service';
import { LogInDto } from './dto/Login.dto';
import { plainToClass } from 'class-transformer';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerData: RegisterDto) {
    const realRegiterData = plainToClass(RegisterDto, registerData, {
      excludeExtraneousValues: true,
    });

    return this.authService.register(realRegiterData);
  }

  @Post('login')
  login(@Body() loginData: LogInDto, @Response() res) {
    return this.authService.login(loginData, res);
  }

  @Get('signout')
  signout(@Request() req, @Response() res) {
    return this.authService.signout(req, res);
  }
}
