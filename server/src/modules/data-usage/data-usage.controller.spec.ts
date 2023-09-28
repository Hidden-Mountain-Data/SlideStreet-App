import { Test, TestingModule } from '@nestjs/testing';
import { DataUsageController } from './data-usage.controller';
import { DataUsageService } from './data-usage.service';

describe('DataUsageController', () => {
  let controller: DataUsageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataUsageController],
      providers: [DataUsageService],
    }).compile();

    controller = module.get<DataUsageController>(DataUsageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
