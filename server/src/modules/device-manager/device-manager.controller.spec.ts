import { Test, TestingModule } from '@nestjs/testing';
import { DeviceManagerController } from './device-manager.controller';
import { DeviceManagerService } from './device-manager.service';

describe('DeviceManagerController', () => {
  let controller: DeviceManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceManagerController],
      providers: [DeviceManagerService],
    }).compile();

    controller = module.get<DeviceManagerController>(DeviceManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
