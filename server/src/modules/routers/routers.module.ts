import { Module, forwardRef } from '@nestjs/common';
import { SessionUserGuard } from '../../guards/session-user.guard';
import { HttpHelpers } from '../../helpers/http-helpers';
import { OwnershipHelpers } from '../../helpers/ownership-helpers';
import { PrismaService } from '../../services/prisma.service';
import { SessionService } from '../../session/session.service';
import { SimsModule } from '../sims/sims.module';
import { UserProvider } from '../users/user.provider';
import { UsersModule } from '../users/users.module';
import { RouterLocationsController } from './controllers/router-locations.controller';
import { RoutersController } from './controllers/routers.controller';
import { RouterLocationsService } from './services/router-locations.service';
import { RoutersService } from './services/routers.service';

@Module({
  imports: [UsersModule, forwardRef(() => SimsModule)],
  controllers: [RoutersController, RouterLocationsController],
  providers: [
    RoutersService,
    RouterLocationsService,
    PrismaService,
    UserProvider,
    SessionUserGuard,
    SessionService,
    HttpHelpers,
    OwnershipHelpers,
  ],
  exports: [RoutersService],
})
export class RoutersModule {}
