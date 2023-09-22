import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Users } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import * as humps from 'humps';
import { FileService } from 'src/services/file.service';
import { PrismaService } from 'src/services/prisma.service';
import { comparePasswords } from '../../../helpers/utils';
import { roundsOfHashing } from '../auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProvider } from './user.provider';

interface IRequestWithUser extends Request {
  user: Users;
}

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly userProvider: UserProvider,
    private fileService: FileService,
    @Inject(REQUEST) private readonly req: IRequestWithUser,
  ) {}

  // Uncomment and import Logger to see logging in this file
  // private readonly logger = new Logger(UsersService.name);

  private currentUser(): Users {
    return this.userProvider.user;
  }

  async users(params: { skip?: number; take?: number }): Promise<Users[]> {
    const { skip, take } = params;
    return this.prisma.users.findMany({
      skip,
      take,
    });
  }

  async findOneByUsername(email: string): Promise<Users> {
    return await this.prisma.users.findUnique({
      where: { email: email },
    });
  }

  async findByLogin({ email, password }: LoginUserDto): Promise<Users> {
    // this.logger.debug(`Attempting to find user by login: ${email}`);

    try {
      const user = await this.prisma.users.findUnique({
        where: { email },
      });

      if (!user) {
        // this.logger.debug(`No user found for username: ${email}`);
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      // this.logger.debug(
      //   `  Stored password type and value: ${typeof user.password}, ${
      //     user.password
      //   }`,
      // );
      // this.logger.debug(
      // `Entered password type and value: ${typeof password}, ${password}`,
      // );

      const areEqual = await comparePasswords(user.password, password);

      if (!areEqual) {
        // this.logger.debug(`No match on the password: ${password}`);
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      // this.logger.debug(`User found and authenticated: ${email}`);
      return user;
    } catch (err) {
      // this.logger.error(`Error in findByLogin: ${err}`);
      throw new HttpException(
        'Failed to login',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async me(): Promise<Users | HttpException> {
    try {
      return await this.prisma.users.findUnique({
        where: { userId: this.currentUser().userId },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'There was a problem while retrieving User. Check the userId.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    updateUserDto: UpdateUserDto,
    id?: number,
  ): Promise<Users | HttpException> {
    try {
      const {
        firstName,
        lastName,
        fullName,
        email,
        password,
        image,
        isActive,
        phone,
        stripeCustomerId,
      } = humps.camelizeKeys(updateUserDto) as UpdateUserDto;

      const image_uuid = image
        ? await this.fileService.transformAndSave(image)
        : await this.fileService.userPlaceholderImageAndSave();

      let hashedPassword = '';
      if (password) {
        hashedPassword = await bcrypt.hash(password, roundsOfHashing);
      }

      const payload = <
        {
          firstName: string;
          lastName: string;
          fullName: string;
          email: string;
          password?: string;
          isActive?: boolean;
          imageUuid: string;
          imageUrl: string;
          phone: string;
          stripeCustomerId: string;
        }
      >{
        firstName,
        lastName,
        fullName,
        email,
        phone,
        stripeCustomerId,
        ...(password !== undefined ? { password: hashedPassword } : {}),
        ...(isActive !== undefined ? { isActive: isActive } : {}),
      };

      if (image) {
        payload.imageUuid = image_uuid;
        payload.imageUrl =
          this.req.protocol +
          '://' +
          this.req.get('host') +
          `/api/images/${image_uuid}`;
      }

      const user = this.prisma.users.update({
        where: {
          userId: id ? id : this.currentUser().userId,
        },
        data: payload,
      });
      return user;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Error updating user',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
