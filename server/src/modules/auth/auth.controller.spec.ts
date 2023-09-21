import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockJwtService: jest.Mocked<JwtService>;
  let mockUsersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    mockJwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
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

    mockAuthService = {
      someMethod: jest.fn(),
      anotherMethod: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'test' })],
      controllers: [AuthController],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
