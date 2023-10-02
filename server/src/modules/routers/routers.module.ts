import { Module } from '@nestjs/common';
import { SessionUserGuard } from '../../guards/session-user.guard';
import { PrismaService } from '../../services/prisma.service';
import { SessionService } from '../../session/session.service';
import { SimsService } from '../sims/sims.service';
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
    SessionUserGuard,
    SessionService,
    SimsService,
  ],
})
export class RoutersModule {}
