import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { GlobalProvider } from '@globals/provider/global.provider';

@Catch(HttpException)
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private globalProvider: GlobalProvider) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    response.status(status).json({
      exception: {
        status: exception['status'],
        error_type: exception['response']['error'],
        message: exception['message'],
      },
      timestamp: this.globalProvider.formatDate(new Date(Date.now())),
      path: request.url,
      body: request.body,
    });
  }
}
