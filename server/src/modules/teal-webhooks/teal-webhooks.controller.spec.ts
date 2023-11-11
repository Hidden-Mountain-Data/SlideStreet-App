import { Test, TestingModule } from '@nestjs/testing';
import { TealWebhooksController } from './teal-webhooks.controller';

describe('TealWebhooksController', () => {
  let controller: TealWebhooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TealWebhooksController],
    }).compile();

    controller = module.get<TealWebhooksController>(TealWebhooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
