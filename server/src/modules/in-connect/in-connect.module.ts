import { Module } from '@nestjs/common';
import { InConnectService } from './in-connect.service';
import { InConnectController } from './in-connect.controller';

@Module({
  controllers: [InConnectController],
  providers: [InConnectService]
})
export class InConnectModule {}
