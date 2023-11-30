import { Test, TestingModule } from '@nestjs/testing';
import { TealController } from './teal.controller';

describe('TealController', () => {
  let controller: TealController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TealController],
    }).compile();

    controller = module.get<TealController>(TealController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
