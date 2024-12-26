import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CustomLogger } from '../logger/custom.logger';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new CustomLogger();

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    const errorDetails = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      success: false,
      error: this.getErrorMessage(errorResponse),
      details: this.getErrorDetails(errorResponse)
    };

    // Log the error with context
    this.logError(errorDetails, exception);
    response.status(status).json(errorDetails);
  }

  private getErrorMessage(errorResponse: any): string {
    if (typeof errorResponse === 'string') {
      return errorResponse;
    }
    return errorResponse.message || 'Internal server error';
  }

  private getErrorDetails(errorResponse: any): any {
    if (errorResponse.details || errorResponse.errors) {
      return errorResponse.details || errorResponse.errors;
    }
    return null;
  }

  private logError(errorDetails: any, exception: HttpException): void {
    const context = 'HttpExceptionFilter';
    const message = `${errorDetails.method} ${errorDetails.path} - Status ${errorDetails.statusCode}`;
    
    if (errorDetails.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(message, exception.stack, context);
    } else {
      this.logger.warn(message, context);
    }
  }
}
