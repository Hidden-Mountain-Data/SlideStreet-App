import { REQUEST } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { DimUser, Role } from '@prisma/client';
import { FileService } from '../../services/file.service';
import { PrismaService } from '../../services/prisma.service';
import { UserProvider } from './user.provider';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let userService: UsersService;
  let mockPrisma: jest.Mocked<PrismaService>;
  let mockUserProvider: jest.Mocked<UserProvider>;
  let mockFileService: jest.Mocked<FileService>;

  beforeEach(async () => {
    mockPrisma = {
      dimUser: {
        findMany: jest.fn().mockResolvedValue([
          {
            userId: 1,
            address: '123 Mock St.',
            email: 'mock1@example.com',
            firstName: 'Mock',
            lastName: 'User1',
            fullName: 'Mock User1',
            password: 'mockPasswordHash1',
            phone: '123-123-1234',
            token: 'mockToken1',
            role: 'USER' as Role,
            createdAt: new Date(),
            updatedAt: new Date(),
            deletedAt: null,
            addressId: 'someAddressId1',
            apiKey: 'someApiKey1',
            refreshToken: 'someRefreshToken1',
            stripeCustomerId: 'someStripeCustomerId1',
            isActive: true,
            imageUuid: 'someImageUuid1',
            imageUrl: 'someImageUrl1',
          },
        ]),

        findUnique: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            userId: 1,
            email: 'test@example.com',
          });
        }),

        update: jest.fn().mockImplementation(() => {
          return Promise.resolve({
            userId: 1,
            email: 'updated@example.com',
          });
        }),
      },
      $connect: jest.fn(),
    } as unknown as jest.Mocked<PrismaService>;

    mockUserProvider = {
      get user() {
        return {
          userId: 123,
          address: '123 E St.',
          email: 'mock@example.com',
          firstName: 'Mock',
          lastName: 'User',
          fullName: 'Mock User',
          password: 'mockPasswordHash',
          phone: '123-123-1234',
          token: '123',
          role: 'USER' as Role,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          addressId: 'someAddressId',
          apiKey: 'someApiKey',
          refreshToken: 'someRefreshToken',
          stripeCustomerId: 'someStripeCustomerId',
          isActive: true,
          imageUuid: 'someImageUuid',
          imageUrl: 'someImageUrl',
        } as unknown as DimUser;
      },
    } as jest.Mocked<UserProvider>;

    mockFileService = {
      transformAndSave: jest.fn().mockResolvedValue('mockFileUuid'),
      userPlaceholderImageAndSave: jest
        .fn()
        .mockResolvedValue('mockPlaceholderUuid'),
      serveImage: jest.fn().mockResolvedValue(null),
      checkAndCreateUploadsDirectory: jest.fn(),
      copyFiles: jest.fn().mockResolvedValue(void 0),
    } as jest.Mocked<FileService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: UserProvider, useValue: mockUserProvider },
        { provide: FileService, useValue: mockFileService },
        { provide: REQUEST, useValue: {} }, // Mock request object
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });
});
