import { Test, TestingModule } from '@nestjs/testing';
import { DeviceActionsService } from './device-actions.service';

describe('DeviceActionsService', () => {
  let service: DeviceActionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceActionsService],
    }).compile();

    service = module.get<DeviceActionsService>(DeviceActionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
