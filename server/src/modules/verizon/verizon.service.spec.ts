import { Test, TestingModule } from '@nestjs/testing';
import { VerizonService } from './verizon.service';

describe('VerizonService', () => {
  let service: VerizonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VerizonService],
    }).compile();

    service = module.get<VerizonService>(VerizonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
