import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CustomException } from './custom.exception';
import { ErrorCodes } from '../enums/error-codes.enum';
import { Error, MongooseError } from 'mongoose';

type errorResponse =
  | string
  | {
      statusCode: number;
      message: string | string[];
      error: string;
    };

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    const assembleException = (status: number) => {
      console.error(
        exception.stack,
        `Exception: ${exception.message} Code: ${status}`,
      );

      response.status(status).json({
        code: exception['code'],
        message: exception.message,
      });
    };
    switch (exception['code']) {
      case 11000:
        assembleException(HttpStatus.CONFLICT);
        return;
    }
    const status =
      exception instanceof CustomException ||
      (exception instanceof HttpException &&
        !(exception instanceof NotFoundException))
        ? exception.getStatus()
        : exception instanceof NotFoundException &&
          exception.message.includes('Cannot')
        ? HttpStatus.METHOD_NOT_ALLOWED
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const code =
      exception instanceof CustomException
        ? exception.getCode()
        : ErrorCodes.UNDEFINED;

    const message: string | string[] =
      exception instanceof HttpException
        ? this.parseResponse(exception.getResponse() as errorResponse)
        : [exception.message];

    console.error(exception.stack, `Exception: ${message} Code: ${status}`);

    response.status(status).json({
      code,
      message,
    });
  }

  private parseResponse(response: errorResponse): string[] {
    if (typeof response === 'string') {
      return [response];
    }
    if (Array.isArray(response.message)) {
      return [...response.message];
    }
    return [response.message];
  }
}
