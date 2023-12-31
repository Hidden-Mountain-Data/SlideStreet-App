import { HttpException, HttpStatus, Injectable, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import * as humps from 'humps';
import { PrismaService } from 'src/services/prisma.service';
import { UserSession } from '../../interfaces/SessionWithUser';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { UsersService } from '../users/users.service';
import { RegistrationStatus } from './registration-status';

export const roundsOfHashing = 10;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async register(
    data: CreateUserDto,
  ): Promise<RegistrationStatus | HttpException> {
    console.log('CAMELIZED', humps.camelizeKeys(data));
    const hashedPassword = await bcrypt.hash(data.password, roundsOfHashing);

    data.password = hashedPassword;

    const { email, password, firstName, lastName } = humps.camelizeKeys(
      data,
    ) as CreateUserDto;

    const fullName = `${firstName} ${lastName}`;

    try {
      await this.prisma.users.create({
        data: {
          email,
          password,
          firstName,
          lastName,
          fullName,
        },
      });

      return {
        success: true,
        message: 'New user Created!',
      };
    } catch (err) {
      if (err instanceof Error) {
        console.log(err);
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
      throw new HttpException(
        'An unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(
    @Req() request: Request,
    loginUserDto: LoginUserDto,
  ): Promise<Users> {
    try {
      const user = await this.usersService.findByLogin(loginUserDto);

      if (!user) {
        console.error('User not found');
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      }

      (request.session as UserSession).userId = user.userId;

      const token = this.jwtService.sign(loginUserDto);

      user.token = token;

      return user;
    } catch (err) {
      console.log('Caught an error', err);
      throw err;
    }
  }

  async getProfile(username: string): Promise<Users> {
    return await this.usersService.findOneByUsername(username);
  }
}
