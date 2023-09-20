import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { User } from '../users/entities/user';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RegistrationStatus } from './registration-status';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegistrationStatus | HttpException> {
    return await this.authService.register(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<User> {
    return await this.authService.login(loginUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<User> {
    return await this.authService.getProfile(req.user.email);
  }
}
