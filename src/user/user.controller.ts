import {
  Body,
  Controller,
  Request,
  UseGuards,
  Patch,
  Get,
} from '@nestjs/common';
import { UserService } from './user.service';
import JwtAuthenticationGuard from '../auth/guard/Jwt-authentication.guard';
import { UpdateUserDto } from './dto/updateUser.dto';
import { plainToClass } from 'class-transformer';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Patch('update')
  @UseGuards(JwtAuthenticationGuard)
  updateInformation(@Body() user: UpdateUserDto, @Request() req) {
    const realBody = plainToClass(UpdateUserDto, user, {
      excludeExtraneousValues: true,
    });

    return this.userService.updateUser(realBody, req);
  }

  @Get('')
  @UseGuards(JwtAuthenticationGuard)
  getUserInfo(@Request() req) {
    return this.userService.getUserInfo(req);
  }
}
