import {
    ClassSerializerInterceptor,
    Controller,
    DefaultValuePipe,
    Get,
    ParseIntPipe,
    Query,
    UseGuards,
    UseInterceptors,
    HttpException,
    Patch,
    Body
} from '@nestjs/common';
import { DimUser } from '@prisma/client';
import { UsersService } from './users.service';
import { AuthGuard } from './../auth/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';


@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    @UseGuards(AuthGuard)
    async index(
        @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip = 0,
        @Query('take', new DefaultValuePipe(10), ParseIntPipe) take = 10,
    ): Promise<DimUser[]> {
        return this.usersService.users({ skip, take });
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get('me')
    @UseGuards(AuthGuard)
    async me(): Promise<DimUser|HttpException> {
        return await this.usersService.me();
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Patch('me')
    @UseGuards(AuthGuard)
    async updateMe(@Body() updateUserDto: UpdateUserDto): Promise<DimUser|HttpException> {
        return await this.usersService.update(updateUserDto);
    }
}
