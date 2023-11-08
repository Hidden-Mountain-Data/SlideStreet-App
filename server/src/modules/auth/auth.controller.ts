import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { User } from '../users/entities/user';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RegistrationStatus } from './registration-status';

interface CustomExpressUserRequest extends ExpressRequest {
  user: {
    email: string;
  };
}

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegistrationStatus | HttpException> {
    const result = await this.authService.register(createUserDto);

    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Req() request: ExpressRequest,
    @Body() loginUserDto: LoginUserDto,
  ): Promise<User> {
    const result = await this.authService.login(request, loginUserDto);

    return result;
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req: CustomExpressUserRequest): Promise<User> {
    return await this.authService.getProfile(req.user.email);
  }
}
