import { Module, forwardRef } from '@nestjs/common';
import { SessionUserGuard } from '../../guards/session-user.guard';
import { HttpHelpers } from '../../helpers/http-helpers';
import { OwnershipHelpers } from '../../helpers/ownership-helpers';
import { PrismaService } from '../../services/prisma.service';
import { SessionService } from '../../session/session.service';
import { RoutersModule } from '../routers/routers.module';
import { SimsModule } from '../sims/sims.module';
import { UserProvider } from '../users/user.provider';
import { UsersModule } from '../users/users.module';
import { DataUsageController } from './data-usage.controller';
import { DataUsageService } from './data-usage.service';

@Module({
  imports: [
    UsersModule,
    forwardRef(() => RoutersModule),
    forwardRef(() => SimsModule),
  ],
  controllers: [DataUsageController],
  providers: [
    DataUsageService,
    HttpHelpers,
    OwnershipHelpers,
    PrismaService,
    SessionService,
    SessionUserGuard,
    UserProvider,
  ],
})
export class DataUsageModule {}
