import { Module } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { SessionService } from '../../session/session.service';
import { UserProvider } from '../users/user.provider';
import { UsersModule } from '../users/users.module';
import { RouterLocationsController } from './controllers/router-locations.controller';
import { RoutersController } from './controllers/routers.controller';
import { RouterLocationsService } from './services/router-locations.service';
import { RoutersService } from './services/routers.service';

@Module({
  imports: [UsersModule],
  controllers: [RoutersController, RouterLocationsController],
  providers: [
    RoutersService,
    RouterLocationsService,
    PrismaService,
    UserProvider,
    SessionService,
  ],
})
export class RoutersModule {}
