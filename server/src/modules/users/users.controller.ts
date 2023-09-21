import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Get,
  HttpException,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  @UseGuards(AuthGuard)
  async index(
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip = 0,
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take = 10,
  ): Promise<User[]> {
    return this.usersService.users({ skip, take });
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('me')
  @UseGuards(AuthGuard)
  async me(): Promise<User | HttpException> {
    return await this.usersService.me();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('me')
  @UseGuards(AuthGuard)
  async updateMe(
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User | HttpException> {
    return await this.usersService.update(updateUserDto);
  }
}
