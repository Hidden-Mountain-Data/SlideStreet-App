import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DimUser } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import * as humps from 'humps';
import { comparePasswords } from '../../../helpers/utils';
import { FileService } from '../../services/file.service';
import { PrismaService } from '../../services/prisma.service';
import { roundsOfHashing } from '../auth/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProvider } from './user.provider';

interface IRequestWithUser extends Request {
  user: DimUser;
}

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly userProvider: UserProvider,
    private fileService: FileService,
    @Inject(REQUEST) private readonly req: IRequestWithUser,
  ) {}

  private currentUser(): DimUser {
    return this.userProvider.user;
  }

  async users(params: { skip?: number; take?: number }): Promise<DimUser[]> {
    const { skip, take } = params;
    return this.prisma.dimUser.findMany({
      skip,
      take,
    });
  }

  async findOneByUsername(email: string): Promise<DimUser> {
    return await this.prisma.dimUser.findUnique({
      where: { email: email },
    });
  }

  async findByLogin({ username, password }: LoginUserDto): Promise<DimUser> {
    const user = await this.prisma.dimUser.findUnique({
      where: { email: username },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await comparePasswords(user.password, password);

    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async me(): Promise<DimUser | HttpException> {
    try {
      return await this.prisma.dimUser.findUnique({
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
  ): Promise<DimUser | HttpException> {
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

      const user = this.prisma.dimUser.update({
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