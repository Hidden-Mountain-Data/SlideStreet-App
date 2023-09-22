import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Post,
  Request,
} from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { Routers } from '@prisma/client';
import { CreateRouterDto } from './dto/create-router.dto';
import { RouterAddStatus } from './router-types';
import { RoutersService } from './routers.service';

@Controller('routers')
export class RoutersController {
  constructor(private readonly routersService: RoutersService) {}

  private readonly logger = new Logger(RoutersController.name);

  @Post('add-router')
  public async addRouter(
    @Request() req: any,
    @Body() createRouterDto: CreateRouterDto,
  ): Promise<RouterAddStatus | HttpException> {
    this.logger.debug(
      `Received createRouterDto: ${JSON.stringify(createRouterDto)}`,
    );

    req.user = { id: 1 };

    const result = await this.routersService.addRouterToAccount({
      ...createRouterDto,
      userId: req.user.id,
    });
    this.logger.debug(`Register result: ${JSON.stringify(result)}`);

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
