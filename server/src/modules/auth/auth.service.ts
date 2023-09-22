import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Users } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as humps from 'humps';
import { PrismaService } from 'src/services/prisma.service';
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

  // * Uncomment and import Logger to see logging in this file
  // private readonly logger = new Logger(AuthService.name);

  async register(
    data: CreateUserDto,
  ): Promise<RegistrationStatus | HttpException> {
    // this.logger.debug(
    //   `Processing registration with data: ${JSON.stringify(data)}`,
    // );
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

  async login(loginUserDto: LoginUserDto): Promise<Users> {
    // this.logger.debug(`Starting login for email: ${loginUserDto.email}`);

    try {
      const user = await this.usersService.findByLogin(loginUserDto);

      // if (!user) {
      //   this.logger.debug(`No user found for email: ${loginUserDto.email}`);
      //   return null;
      // }

      const token = this.jwtService.sign(loginUserDto);
      user.token = token;

      // this.logger.debug(`Token generated for user: ${user.token}`);

      return user;
    } catch (err) {
      // this.logger.debug(`Err in the catch: ${err}`);
      throw err;
    }
  }

  async getProfile(username: string): Promise<Users> {
    return await this.usersService.findOneByUsername(username);
  }
}
