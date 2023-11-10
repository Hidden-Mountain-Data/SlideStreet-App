import { Test, TestingModule } from '@nestjs/testing';
import { InConnectController } from './in-connect.controller';
import { InConnectService } from './in-connect.service';

describe('InConnectController', () => {
  let controller: InConnectController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InConnectController],
      providers: [InConnectService],
    }).compile();

    controller = module.get<InConnectController>(InConnectController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
