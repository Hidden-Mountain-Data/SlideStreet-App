import { Module } from '@nestjs/common';
import { TealPollingService } from './tasks.service';


@Module({
    imports: [],
    providers: [TealPollingService],
    exports: [TealPollingService]
})
export class TealPollingModule { }