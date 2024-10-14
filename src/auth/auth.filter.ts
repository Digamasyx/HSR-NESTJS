import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { AuthProvider } from './auth.provider';

@Catch(HttpException)
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(private authProvider: AuthProvider) {}
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    response.status(status).json({
      exception: {
        status: status,
        message: exception['message'],
      },
      timestamp: this.authProvider.formatDate(new Date(Date.now())),
      path: request.url,
    });
  }
}
