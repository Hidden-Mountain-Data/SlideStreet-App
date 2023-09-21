import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { DimUser, Role } from '@prisma/client';
import { PrismaService } from '../../services/prisma.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUsersService: jest.Mocked<UsersService>;
  let mockJwtService: jest.Mocked<JwtService>;
  let mockPrismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    mockJwtService = {
      sign: jest.fn().mockReturnValue('someToken'),
      verify: jest.fn().mockReturnValue({}),
    } as unknown as jest.Mocked<JwtService>;

    mockUsersService = {
      users: jest.fn().mockImplementation(() => {
        return Promise.resolve([
          {
            userId: 1,
            email: 'johndoe@example.com',
          },
          {
            userId: 2,
            email: 'janedoe@example.com',
          },
        ]);
      }),
      findOneByUsername: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          userId: 1,
          email: 'johndoe@example.com',
        });
      }),
      findByLogin: jest.fn().mockImplementation(({ username, password }) => {
        if (username === 'johndoe@example.com' && password === 'password') {
          return Promise.resolve({
            userId: 1,
            email: 'johndoe@example.com',
          });
        } else {
          throw new Error('Invalid credentials');
        }
      }),
      me: jest.fn().mockImplementation(() => {
        return Promise.resolve({
          userId: 1,
          email: 'johndoe@example.com',
        });
      }),
      update: jest.fn().mockImplementation((updateUserDto, id) => {
        return Promise.resolve({
          userId: id,
          email: updateUserDto.email,
        });
      }),
    } as unknown as jest.Mocked<UsersService>;

    mockPrismaService = {
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

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    // mockUsersService = module.get(UsersService);
    mockJwtService = module.get(JwtService);
    mockPrismaService = module.get(PrismaService);
  });

  describe('getProfile', () => {
    it('should return a user profile', async () => {
      const mockDimUser: DimUser = {
        userId: 123,
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
      };

      mockUsersService.findOneByUsername.mockResolvedValue(mockDimUser);

      const username = 'test@example.com';
      const profile = await authService.getProfile(username);
      expect(profile).toBeDefined();
      expect(profile.email).toEqual(mockDimUser.email);
    });
  });
});
