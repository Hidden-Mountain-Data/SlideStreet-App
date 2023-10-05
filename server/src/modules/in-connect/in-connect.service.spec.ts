import { Test, TestingModule } from '@nestjs/testing';
import { InConnectService } from './in-connect.service';

describe('InConnectService', () => {
  let service: InConnectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InConnectService],
    }).compile();

    service = module.get<InConnectService>(InConnectService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
