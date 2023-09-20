import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { PrismaService } from 'src/services/prisma.service';
import { RegistrationStatus } from './registration-status';
export const roundsOfHashing = 10;
import * as bcrypt from 'bcrypt';
import { DimUser } from '@prisma/client';
import { User } from 'src/users/entities/user';
import * as humps from 'humps';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService
  ) { }

  async register(data: CreateUserDto): Promise<RegistrationStatus | HttpException> {
    try {

       console.log("CAMELIZED", humps.camelizeKeys(data));
      const hashedPassword = await bcrypt.hash(
        data.password,
        roundsOfHashing,
      );
  
      data.password = hashedPassword;

      const userInDb = await this.usersService.findOneByUsername(data.email);

      if (userInDb) {
        throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
      }

      const { email, password, firstName, lastName, fullName, stripeCustomerId, phone } = humps.camelizeKeys(data) as CreateUserDto;

      await this.prisma.dimUser.create({
        data: {
          email,password,firstName,lastName,fullName,stripeCustomerId,phone,
          token: ''
        }
      });
      return {
        success: true,
        message: "New user Created!"
      }
    } catch (err) {
      console.log(err);
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }

  }

  async login(loginUserDto: LoginUserDto): Promise<User> {
    const user = await this.usersService.findByLogin(loginUserDto);
    user.token = this.jwtService.sign(loginUserDto);
    return user;
  }

  async getProfile(username: string): Promise<DimUser>{
    return await this.usersService.findOneByUsername(username);
  }

}