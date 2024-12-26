import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';
import { CustomLogger } from '../logger/custom.logger';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  private readonly logger = new CustomLogger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest();
    const startTime = Date.now();

    return next.handle().pipe(
      map(data => {
        const response = context.switchToHttp().getResponse();
        const duration = Date.now() - startTime;
        const responseData = this.transformResponse(data, response.statusCode);
        
        this.logResponse(request, responseData, duration);
        
        return responseData;
      })
    );
  }

  private transformResponse(data: any, statusCode: number): ApiResponse<T> {
    return {
      success: true,
      data: data.message ? { ...data, message: undefined } : data,
      message: data.message || 'Operation successful',
      statusCode,
      apiVersion: '1.0',
    };
  }

  private logResponse(request: any, response: ApiResponse<T>, duration: number): void {
    const logMessage = `${request.method} ${request.url} - ${response.statusCode} - ${duration}ms`;
    this.logger.log(logMessage, 'TransformInterceptor');
  }
}
