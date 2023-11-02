import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import * as humps from 'humps';
import { FileService } from 'src/services/file.service';
import { PrismaService } from 'src/services/prisma.service';
import { comparePasswords } from '../../../helpers/utils';
import { roundsOfHashing } from '../auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user';
import { UserProvider } from './user.provider';

interface IRequestWithUser extends Request {
  user: User;
}

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly userProvider: UserProvider,
    private fileService: FileService,
    @Inject(REQUEST) private readonly req: IRequestWithUser,
  ) {}

  private currentUser(): User {
    return this.userProvider.user;
  }

  async users(params: { skip?: number; take?: number }): Promise<UserEntity[]> {
    const { skip, take } = params;
    return this.prisma.user.findMany({
      skip,
      take,
    });
  }

  async findOneByUsername(email: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { email: email },
    });
  }

  async findByLogin({ email, password }: LoginUserDto): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      const areEqual = await comparePasswords(user.password, password);

      if (!areEqual) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }

      return user;
    } catch (err) {
      throw new HttpException(
        'Failed to login',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async me(): Promise<User | HttpException> {
    try {
      return await this.prisma.user.findUnique({
        where: { userId: this.currentUser().userId },
      });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'There was a problem while retrieving UserEntity. Check the userId.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    updateUserDto: UpdateUserDto,
    id?: number,
  ): Promise<User | HttpException> {
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

      const user = this.prisma.user.update({
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
