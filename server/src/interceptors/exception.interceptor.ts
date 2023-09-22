import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
  intercept<T>(_context: ExecutionContext, next: CallHandler): Observable<T> {
    return next.handle().pipe(
      catchError((err: unknown) => {
        let statusCode = 500;
        let response = {};

        if (typeof err === 'object' && err !== null) {
          if ('getStatus' in err && typeof err['getStatus'] === 'function') {
            statusCode = err['getStatus']();
          }

          if (
            'getResponse' in err &&
            typeof err['getResponse'] === 'function'
          ) {
            response = err['getResponse']();
          }
        }

        return throwError(
          () =>
            new HttpException(
              {
                version: '1.0',
                id: uuidV4(),
                code: statusCode,
                message: 'Error',
                errors: response,
              },
              statusCode,
            ),
        );
      }),
    );
  }
}
