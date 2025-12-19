import { APIOperationError } from '@involvemint/shared/domain';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class  APIOperationErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception.getStatus instanceof Function ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const operation = this.getLastSegment(request.url as string);

    const errorResponse: APIOperationError = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      operation,
      message: exception.message,
      response: typeof exception.getResponse === 'function' ? exception.getResponse() : exception.message,
    };

    Logger.error(
      `\nOperation:\t\t${operation}\nResponse:\t${JSON.stringify(errorResponse)}`,
      exception.stack,
      'APIErrorFilter'
    );

    response.status(status).send(errorResponse);
  }

  private getLastSegment(url: string): string {
    const lastSlashIndex = url.lastIndexOf('/');
    return url.substring(lastSlashIndex + 1);
  }
}
