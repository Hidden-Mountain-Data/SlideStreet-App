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

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // * Uncomment and import Logger to use the logging in this file
  // private readonly logger = new Logger(AuthController.name);

  @Post('register')
  public async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<RegistrationStatus | HttpException> {
    // * Logging incoming login request data
    // this.logger.debug(
    //   `Received createUserDto: ${JSON.stringify(createUserDto)}`,
    // );
    const result = await this.authService.register(createUserDto);
    // Logging the result of the registration attempt
    // this.logger.debug(`Register result: ${JSON.stringify(result)}`);

    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<User> {
    // * Logging incoming login request data
    // this.logger.debug(`Received loginUserDto: ${JSON.stringify(loginUserDto)}`);
    const result = await this.authService.login(loginUserDto);
    // * Logging the result of the login attempt
    // if (result && result.token) {
    //   this.logger.debug(`Login successful for email: ${result.email}`);
    // } else {
    //   this.logger.warn(`Login failed for email: ${loginUserDto.email}`);
    // }

    return result;
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req: CustomExpressUserRequest): Promise<User> {
    return await this.authService.getProfile(req.user.email);
  }
}
