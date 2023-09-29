import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiResponseInterceptor } from './interceptors/api-response.interceptor';
import { ExceptionInterceptor } from './interceptors/exception.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { DataUsageModule } from './modules/data-usage/data-usage.module';
import { DatesModule } from './modules/dates/dates.module';
import { RoutersModule } from './modules/routers/routers.module';
import { UsersModule } from './modules/users/users.module';
import { FileService } from './services/file.service';
import { PrismaService } from './services/prisma.service';
import { SessionService } from './session/session.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ScheduleModule.forRoot(),
    RoutersModule,
    DatesModule,
    DataUsageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    FileService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ExceptionInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    PrismaService,
    SessionService,
  ],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer): void {
//     consumer.apply(DebugMiddleware).forRoutes('*');
//   }
// }
