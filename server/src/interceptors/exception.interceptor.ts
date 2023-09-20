import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError as observableThrowError } from 'rxjs';
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
      catchError((err: HttpException) =>
        observableThrowError(
          () =>
            new HttpException(
              {
                version: '1.0',
                id: uuidV4(),
                code: err.getStatus(),
                message: 'Error',
                errors: err.getResponse(),
              },
              err.getStatus(),
            ),
        ),
      ),
    );
  }
}
