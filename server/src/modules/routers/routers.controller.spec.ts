import { Test, TestingModule } from '@nestjs/testing';
import { RoutersController } from './controllers/routers.controller';
import { RoutersService } from './services/routers.service';

describe('RoutersController', () => {
  let controller: RoutersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoutersController],
      providers: [RoutersService],
    }).compile();

    controller = module.get<RoutersController>(RoutersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
