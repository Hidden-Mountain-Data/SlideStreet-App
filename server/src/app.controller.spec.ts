import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileService } from './services/file.service';

describe('AppController', () => {
  let appController: AppController;
  let mockFileService: jest.Mocked<FileService>;

  beforeEach(async () => {
    mockFileService = {
      someMethod: jest.fn(),
      anotherMethod: jest.fn(),
    } as unknown as jest.Mocked<FileService>;

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        { provide: FileService, useValue: mockFileService },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('healthCheck', () => {
    it('should return status', () => {
      expect(appController.healthCheck()).toEqual({
        status: 'ok',
      });
    });
  });
});
