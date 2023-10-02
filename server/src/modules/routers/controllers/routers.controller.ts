import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Routers } from '@prisma/client';
import { Request } from 'express';
import { SessionUserGuard } from '../../../guards/session-user.guard';
import { SessionService } from '../../../session/session.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { Sim } from '../../sims/entities/sim.entity';
import { CreateRouterDto } from '../dto/create-router.dto';
import { UpdateRouterDto } from '../dto/update-router.dto';
import { Router } from '../entities/router.entity';
import { RoutersService } from '../services/routers.service';

@Controller('routers')
@UseGuards(JwtAuthGuard, SessionUserGuard)
export class RoutersController {
  constructor(
    private readonly routersService: RoutersService,
    private readonly sessionService: SessionService,
  ) {}

  private getUserIdAndThrowIfUnauthorized(req: Request): number {
    const userId = this.sessionService.getUserIdFromSession(req);
    if (!userId) {
      this.throwHttpException(
        'User ID not found in session',
        HttpStatus.UNAUTHORIZED,
      );
    }
    return userId;
  }

  private throwHttpException(message: string, status: HttpStatus): void {
    throw new HttpException(message, status);
  }

  private async executeSafely<T>(
    operation: () => Promise<T>,
    errorMessage: string,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.throwHttpException(
          error.message,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        this.throwHttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
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

  @Post(':userId')
  public async addRouter(
    @Req() req: Request,
    @Body() createRouterDto: CreateRouterDto,
  ): Promise<Router | HttpException> {
    const userId = this.getUserIdAndThrowIfUnauthorized(req);
    return this.executeSafely(
      () => this.routersService.addRouterToAccount(createRouterDto, userId),
      'Error adding router',
    );
  }

  @Get()
  public async findAllRouters(): Promise<Routers[] | HttpException> {
    return this.executeSafely(
      () => this.routersService.findAllRouters({}),
      'Error fetching all routers',
    );
  }

  @Get(':userId')
  async findAllRoutersByUserId(
    @Req() req: Request,
    @Param('userId', new ParseIntPipe()) userId: number,
  ): Promise<Routers[] | HttpException> {
    const authUserId = this.getUserIdAndThrowIfUnauthorized(req);
    if (authUserId !== userId) {
      this.throwHttpException(
        "Nice try, you're not authorized to access this user's data!",
        HttpStatus.FORBIDDEN,
      );
    }

    return this.routersService.findAllRoutersByUserId(userId);
  }

  @Get('location/:routerId')
  public async findRouterWithLocation(
    @Req() req: Request,
    @Param('routerId', new ParseIntPipe()) routerId: number,
  ): Promise<Routers | HttpException> {
    const userId = this.getUserIdAndThrowIfUnauthorized(req);
    await this.ensureRouterOwnership(routerId, userId);
    return this.executeSafely(
      () => this.routersService.findOneRouterWithLocation(routerId),
      'Error fetching router with location',
    );
  }

  @Get('sim/:routerId')
  public async findSimsByRouterId(
    @Param('routerId', new ParseIntPipe()) routerId: number,
  ): Promise<Sim> {
    return this.routersService.findSimByRouterId(routerId);
  }

  @Patch(':routerId')
  async updateRouter(
    @Req() req: Request,
    @Param('routerId', new ParseIntPipe()) routerId: number,
    @Body() updateRouterDto: UpdateRouterDto,
  ): Promise<Routers | HttpException> {
    const userId = this.getUserIdAndThrowIfUnauthorized(req);
    await this.ensureRouterOwnership(routerId, userId);
    return this.executeSafely(
      () => this.routersService.updateRouter(routerId, updateRouterDto),
      'Error updating router',
    );
  }

  @Delete(':routerId')
  public async removeRouter(
    @Req() req: Request,
    @Param('routerId', new ParseIntPipe()) routerId: number,
  ): Promise<void> {
    const userId = this.getUserIdAndThrowIfUnauthorized(req);
    await this.ensureRouterOwnership(routerId, userId);
    await this.executeSafely(
      () => this.routersService.removeRouter(routerId, userId),
      'Error removing router',
    );
  }
}
