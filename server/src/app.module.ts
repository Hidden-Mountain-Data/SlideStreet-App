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
import { ProxyModule } from './modules/proxy/proxy.module';
import { RoutersModule } from './modules/routers/routers.module';
import { SimsModule } from './modules/sims/sims.module';
import { UsersModule } from './modules/users/users.module';
import { FileService } from './services/file.service';
import { PrismaService } from './services/prisma.service';
import { TealPollingService } from './modules/tasks/tasks.service';
import { SessionService } from './session/session.service';
import { DeviceManagerModule } from './modules/device-manager/device-manager.module';
import { InConnectModule } from './modules/in-connect/in-connect.module';
import { TealWebhooksModule } from './modules/teal-webhooks/teal-webhooks.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ScheduleModule.forRoot(),
    RoutersModule,
    DatesModule,
    DataUsageModule,
    SimsModule,
    ProxyModule,
    DeviceManagerModule,
    InConnectModule,
    TealWebhooksModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    FileService,
    TealPollingService,
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
  exports: [PrismaService],
})
export class AppModule { }
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer): void {
//     consumer.apply(DebugMiddleware).forRoutes('*');
//   }
// }
