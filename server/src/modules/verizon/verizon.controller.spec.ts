import { Test, TestingModule } from '@nestjs/testing';
import { VerizonController } from './verizon.controller';
import { VerizonService } from './verizon.service';

describe('VerizonController', () => {
  let controller: VerizonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerizonController],
      providers: [VerizonService],
    }).compile();

    controller = module.get<VerizonController>(VerizonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
