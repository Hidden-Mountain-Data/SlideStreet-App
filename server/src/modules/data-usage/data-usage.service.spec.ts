import { Test, TestingModule } from '@nestjs/testing';
import { DataUsageService } from './data-usage.service';

describe('DataUsageService', () => {
  let service: DataUsageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataUsageService],
    }).compile();

    service = module.get<DataUsageService>(DataUsageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
