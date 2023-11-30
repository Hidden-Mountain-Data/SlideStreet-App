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
import { DeviceActionsModule } from './modules/device-actions/device-actions.module';
import { DeviceActionsController } from './modules/device-actions/device-actions.controller';
import { TealController } from './modules/teal/teal.controller';
import { TealService } from './modules/teal/teal.service';
import { TealModule } from './modules/teal/teal.module';

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
    TealWebhooksModule,
    DeviceActionsModule,
    TealModule,
    DeviceActionsModule
  ],
  controllers: [AppController, DeviceActionsController, TealController],
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
    TealService,
  ],
  exports: [PrismaService],
})
export class AppModule { }
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer): void {
//     consumer.apply(DebugMiddleware).forRoutes('*');
//   }
// }
