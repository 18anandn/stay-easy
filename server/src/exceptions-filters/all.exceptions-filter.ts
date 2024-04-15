import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const responseBody = {
      statusCode: 500,
      message: 'There was an internal server error.',
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    if (exception instanceof HttpException) {
      responseBody.statusCode = exception.getStatus();
      responseBody.message = exception.message;
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, responseBody.statusCode);
  }
}
