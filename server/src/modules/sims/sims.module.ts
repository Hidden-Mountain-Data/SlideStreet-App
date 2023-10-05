import { Module, forwardRef } from '@nestjs/common';
import { SessionUserGuard } from '../../guards/session-user.guard';
import { HttpHelpers } from '../../helpers/http-helpers';
import { OwnershipHelpers } from '../../helpers/ownership-helpers';
import { PrismaService } from '../../services/prisma.service';
import { SessionService } from '../../session/session.service';
import { RoutersModule } from '../routers/routers.module';
import { UserProvider } from '../users/user.provider';
import { UsersModule } from '../users/users.module';
import { SimsController } from './sims.controller';
import { SimsService } from './sims.service';

@Module({
  imports: [UsersModule, forwardRef(() => RoutersModule)],
  controllers: [SimsController],
  providers: [
    SimsService,
    PrismaService,
    UserProvider,
    SessionUserGuard,
    SessionService,
    SessionService,
    HttpHelpers,
    OwnershipHelpers,
  ],
  exports: [SimsService],
})
export class SimsModule {}
