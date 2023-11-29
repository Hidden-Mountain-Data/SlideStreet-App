import { Test, TestingModule } from '@nestjs/testing';
import { TealService } from './teal.service';

describe('TealService', () => {
  let service: TealService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TealService],
    }).compile();

    service = module.get<TealService>(TealService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
