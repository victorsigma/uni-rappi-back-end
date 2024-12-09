import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Aquí logueamos los detalles del error
    if (exception instanceof Error) {
      this.logger.error(`Error occurred: ${exception.message}`, exception.stack);
    } else {
      this.logger.error('Unknown error', exception);
    }

    // Respuesta al cliente
    response.status(status).json({
      statusCode: status,
      message: typeof message === 'string' ? message : (message as any).message,
      error: exception instanceof HttpException ? (message as any).error || 'Error' : 'Internal Server Error',
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    });
  }
}
