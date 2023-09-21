import { CallHandler, ExecutionContext, HttpException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { ExceptionInterceptor } from './exception.interceptor';

const isUUID = (str: string): boolean => {
  const pattern =
    /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
  return pattern.test(str);
};

describe('ExceptionInterceptor', () => {
  let interceptor: ExceptionInterceptor;
  let mockExecutionContext: jest.Mocked<ExecutionContext>;
  let mockCallHandler: jest.Mocked<CallHandler>;

  beforeEach(() => {
    // Mock ExecutionContext
    mockExecutionContext = {
      getClass: jest.fn(),
      getHandler: jest.fn(),
      // ... other methods
    } as unknown as jest.Mocked<ExecutionContext>;

    // Mock CallHandler
    mockCallHandler = {
      handle: jest.fn(),
    } as jest.Mocked<CallHandler>;

    interceptor = new ExceptionInterceptor();
  });

  it('should catch HttpException and modify it', (done) => {
    const mockHttpException = new HttpException('Mock Exception', 400);
    mockCallHandler.handle.mockReturnValueOnce(throwError(mockHttpException));

    interceptor.intercept(mockExecutionContext, mockCallHandler).subscribe({
      error: (error: HttpException) => {
        const errorResponse = error.getResponse() as any;
        expect(error.getStatus()).toBe(400);
        expect(errorResponse.version).toBe('1.0');
        expect(errorResponse.id).toBeDefined();
        expect(errorResponse.code).toBe(400);
        expect(errorResponse.message).toBe('Error');
        expect(errorResponse.errors).toBe('Mock Exception');
        expect(isUUID(errorResponse.id)).toBe(true); // Validate UUID
        done();
      },
    });
  });

  it('should let successful calls pass through', (done) => {
    mockCallHandler.handle.mockReturnValueOnce(of('Success'));

    interceptor
      .intercept(mockExecutionContext, mockCallHandler)
      .subscribe((result) => {
        expect(result).toBe('Success');
        done();
      });
  });
});
