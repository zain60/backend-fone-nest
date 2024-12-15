import { ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    // Handle validation errors specifically
    if (exception instanceof BadRequestException) {
      const validationErrors = exception.getResponse();
      return response.status(status).json({
        success: false,
        error: 'Validation failed',
        details: validationErrors['message'],
        statusCode: status,
      });
    }

    // Handle other HTTP exceptions
    response.status(status).json({
      success: false,
      error: exception.message,
      statusCode: status
    });
  }
}