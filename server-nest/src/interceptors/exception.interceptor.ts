import {
    CallHandler,
    ConsoleLogger,
    ExecutionContext,
    HttpException,
    HttpStatus,
    Injectable,
    NestInterceptor,
    Response,
  } from '@nestjs/common';
  import { Observable, throwError } from 'rxjs';
  import { catchError, map } from 'rxjs/operators';
  import { v4 as uuidV4 } from 'uuid';
  
  export interface Response<T> {
    version: string;
    id: string;
    code: number;
    message: string;
    errors: T;
  }
  
  @Injectable()
  export class ExceptionInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        catchError((err) =>
          throwError(
            () =>
              new HttpException(
                {
                  version: '1.0',
                  id: uuidV4(),
                  code: err.status,
                  message: 'Error',
                  errors: err,
                },
                err.status,
              ),
          ),
        ),
      );
    }
  }