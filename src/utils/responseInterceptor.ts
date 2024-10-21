import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((data) => {
        return {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: data.message || 'Request successful',
          data: data.data || data,
          timestamp: new Date().toISOString(),
          path: request.url,
          method: request.method,
          responseTime: `${Date.now() - now}ms`,
        };
      }),
    );
  }
}
