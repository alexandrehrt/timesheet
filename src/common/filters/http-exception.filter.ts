import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();

    if (
      exception instanceof BadRequestException ||
      exception instanceof ConflictException
    ) {
      const exceptionResponse = exception.getResponse() as any;
      const validationMessages = exceptionResponse.message;

      const firstErrorMessage = Array.isArray(validationMessages)
        ? validationMessages[0]
        : validationMessages;

      return response.status(status).json({
        mensagem: firstErrorMessage,
      });
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}
