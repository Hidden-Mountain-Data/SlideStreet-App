import { Test, TestingModule } from '@nestjs/testing';
import { DeviceActionsController } from './device-actions.controller';

describe('DeviceActionsController', () => {
  let controller: DeviceActionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeviceActionsController],
    }).compile();

    controller = module.get<DeviceActionsController>(DeviceActionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
