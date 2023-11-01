import { Test, TestingModule } from '@nestjs/testing';
import { TealController } from './teal.controller';
import { TealService } from './teal.service';

describe('TealController', () => {
  let controller: TealController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TealController],
      providers: [TealService],
    }).compile();

    controller = module.get<TealController>(TealController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
