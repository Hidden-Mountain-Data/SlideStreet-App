import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { Routers } from '@prisma/client';
import { User } from '../users/entities/user';
import { UserProvider } from '../users/user.provider';
import { CreateRouterDto } from './dto/create-router.dto';
import { RouterAddStatus } from './router-types';
import { RoutersService } from './routers.service';

@Controller('routers')
export class RoutersController {
  constructor(
    private readonly routersService: RoutersService,
    private readonly userProvider: UserProvider,
  ) {}

  private readonly logger = new Logger(RoutersController.name);

  private currentUser(): User {
    const user = this.userProvider.user;
    this.logger.log('Current User: ' + JSON.stringify(user));
    return user;
  }

  @Post('add-router')
  public async addRouter(
    @Body() createRouterDto: CreateRouterDto,
  ): Promise<RouterAddStatus | HttpException> {
    this.logger.log(
      'createRouterDto value::: ' + JSON.stringify(createRouterDto),
    );
    // createRouterDto.userId = this.currentUser().userId;
    this.logger.log(
      'createRouterDto.userId value::: ' +
        JSON.stringify(createRouterDto.userId),
    );
    console.log('createRouterDto.userId value::: ' + createRouterDto.userId);
    if (!createRouterDto.userId) {
      return new HttpException(
        JSON.stringify(createRouterDto),
        HttpStatus.UNAUTHORIZED,
      );
    }

    const result = await this.routersService.addRouterToAccount({
      ...createRouterDto,
      userId: this.currentUser().userId,
    });
    return result;
  }

  @Get()
  public async findAllRouters(): Promise<Routers[]> {
    this.logger.debug('Fetching all routers');

    try {
      const routers = await this.routersService.findAllRouters({});
      if (Array.isArray(routers)) {
        this.logger.debug(`Found ${routers.length} routers`);
        return routers;
      } else {
        this.logger.warn('Received unexpected non-array response');
        throw new Error('Unexpected response type');
      }
    } catch (err: any) {
      this.logger.error(`Error adding router: ${err.message}`);
      this.logger.error(err.stack);
      throw new HttpException(
        'Error adding router to user account',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.routersService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateRouterDto: UpdateRouterDto) {
  //   return this.routersService.update(+id, updateRouterDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.routersService.remove(+id);
  // }
}
