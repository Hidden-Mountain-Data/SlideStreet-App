import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { FileService } from './services/file.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly fileService: FileService
    ) {}

  @Get('hc')
  healthCheck(): {
    status: string
  } {
    return this.appService.healthCheck();
  }
}
