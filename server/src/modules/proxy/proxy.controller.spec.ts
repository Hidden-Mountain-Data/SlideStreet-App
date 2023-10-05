import { Test, TestingModule } from '@nestjs/testing';
import { ProxyController } from './proxy.controller';
import { DeviceManagerProxyService } from './services/proxy-device-manager.service';
import { InConnectProxyService } from './services/proxy-in-connect.service';

describe('ProxyController', () => {
  let controller: ProxyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProxyController],
      providers: [DeviceManagerProxyService, InConnectProxyService],
    }).compile();

    controller = module.get<ProxyController>(ProxyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
