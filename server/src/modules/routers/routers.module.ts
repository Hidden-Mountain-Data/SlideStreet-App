import { Module, forwardRef } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
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
    JwtService,
    HttpHelpers,
    OwnershipHelpers,
    PrismaService,
    RouterLocationsService,
    RoutersService,
    SessionService,
    UserProvider,
  ],
  exports: [RoutersService],
})
export class RoutersModule {}
