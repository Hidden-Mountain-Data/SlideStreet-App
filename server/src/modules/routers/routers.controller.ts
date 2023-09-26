import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Routers } from '@prisma/client';
import { Request } from 'express';
import { SessionService } from '../../session/session.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateRouterDto } from './dto/create-router.dto';
import { UpdateRouterDto } from './dto/update-router.dto';
import { RouterStatus } from './router-types';
import { RoutersService } from './routers.service';

@Controller('routers')
export class RoutersController {
  constructor(
    private readonly routersService: RoutersService,
    private readonly sessionService: SessionService,
  ) {}

  private throwIfUnauthorized(userId: number | undefined): void {
    if (!userId) {
      throw new HttpException(
        'User ID not found in session',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private getUserId(req: Request): number | undefined {
    const userId = this.sessionService.getUserIdFromSession(req);
    this.throwIfUnauthorized(userId);
    return userId;
  }

  private async ensureRouterOwnership(
    routerId: number,
    userId: number,
  ): Promise<void> {
    if (!(await this.routersService.isRouterOwnedByUser(routerId, userId))) {
      throw new HttpException(
        'This router is not accessible to current account',
        HttpStatus.FORBIDDEN,
      );
    }
  }

  @Post('add-router')
  @UseGuards(JwtAuthGuard)
  public async addRouter(
    @Req() req: Request,
    @Body() createRouterDto: CreateRouterDto,
  ): Promise<RouterStatus | HttpException> {
    const userId = this.getUserId(req);
    createRouterDto.userId = userId;
    return this.routersService.addRouterToAccount(createRouterDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  public async findAllRouters(): Promise<Routers[]> {
    try {
      const routers = await this.routersService.findAllRouters({});
      if (Array.isArray(routers)) {
        return routers;
      } else {
        throw new Error('Unexpected response type');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          'An unknown error occurred',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  async findAllRoutersByUserId(
    @Req() req: Request,
    @Param('userId') paramUserId: number,
  ): Promise<Routers[]> {
    const userId = this.getUserId(req);
    if (userId !== Number(paramUserId)) {
      throw new HttpException(
        'You can only see your own routers',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.routersService.findAllRoutersByUserId(userId);
  }

  @Patch(':routerId')
  @UseGuards(JwtAuthGuard)
  async updateRouter(
    @Req() req: Request,
    @Param('routerId') rawRouterId: string,
    @Body() updateRouterDto: UpdateRouterDto,
  ): Promise<Routers | HttpException> {
    const userId = this.getUserId(req);
    const routerId = Number(rawRouterId);

    await this.ensureRouterOwnership(routerId, userId);

    if (!(await this.routersService.isRouterOwnedByUser(routerId, userId))) {
      throw new HttpException(
        'You are not authorized to update this router',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      const result = await this.routersService.updateRouter(
        routerId,
        updateRouterDto,
      );
      return result;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        throw new HttpException(
          'An unknown error occurred',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Delete(':routerId')
  @UseGuards(JwtAuthGuard)
  public async removeRouter(
    @Req() req: Request,
    @Param('routerId') rawRouterId: string,
  ): Promise<void> {
    const userId = this.getUserId(req);
    const routerId = Number(rawRouterId);

    await this.ensureRouterOwnership(routerId, userId);

    const routerExists = await this.routersService.findOneRouter(routerId);
    if (!routerExists) {
      throw new HttpException('Router not found', HttpStatus.NOT_FOUND);
    }

    await this.routersService.removeRouter(routerId, userId);
  }
}
