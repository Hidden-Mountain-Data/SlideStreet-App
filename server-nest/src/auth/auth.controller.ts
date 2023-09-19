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
  UseInterceptors
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local.auth.guard';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { AuthStatus } from './auth-status';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { RegistrationStatus } from './registration-status';
import { AuthGuard } from './auth.guard';
import { User } from 'src/users/entities/user';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegistrationStatus | HttpException> {
    return await this.authService.register(
      createUserDto,
    );
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<User> {
    return await this.authService.login(loginUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<User>{
    return await this.authService.getProfile(req.user.email)
  }
}