import {
  BadRequestException,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as humps from 'humps';

import { AppModule } from './app.module';

declare const module: any;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose', 'log'],
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors): BadRequestException => {
        const result = errors.map((error) => ({
          [humps.decamelize(error.property)]:
            error.constraints[Object.keys(error.constraints)[0]],
        }));
        return new BadRequestException(result);
      },
      stopAtFirstError: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors({
    origin: ["http://10.0.2.2:3000", "http://localhost:5173"],
    credentials: true
  });
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(
    session({
      secret: process.env.SESSION_SECRET ?? null,
      resave: false,
      saveUninitialized: false,
    }),
  );
  const port = parseInt(process.env.PORT ?? '3000', 10);
  await app.listen(port);

  if(module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
