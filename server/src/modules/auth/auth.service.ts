import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DimUser } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as humps from 'humps';
import { PrismaService } from 'src/services/prisma.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { User } from '../users/entities/user';
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
    try {
      console.log('CAMELIZED', humps.camelizeKeys(data));
      const hashedPassword = await bcrypt.hash(data.password, roundsOfHashing);

      data.password = hashedPassword;

      const userInDb = await this.usersService.findOneByUsername(data.email);

      if (userInDb) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }

      const {
        email,
        password,
        firstName,
        lastName,
        fullName,
        stripeCustomerId,
        phone,
      } = humps.camelizeKeys(data) as CreateUserDto;

      await this.prisma.dimUser.create({
        data: {
          email,
          password,
          firstName,
          lastName,
          fullName,
          stripeCustomerId,
          phone,
          token: '',
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

  async login(loginUserDto: LoginUserDto): Promise<User> {
    const user = await this.usersService.findByLogin(loginUserDto);
    user.token = this.jwtService.sign(loginUserDto);
    return user;
  }

  async getProfile(username: string): Promise<DimUser> {
    return await this.usersService.findOneByUsername(username);
  }
}
