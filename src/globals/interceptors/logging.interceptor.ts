import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IoLogger } from '@globals/provider/log.provider';
import { Request, Response } from 'express';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
  private readonly propriedadesReq = [
    'body',
    'baseUrl',
    'ip',
    'method',
    'query',
  ];
  private readonly propriedadesRes = ['statusCode', 'statusMessage'];

  constructor(private readonly ioLogger: IoLogger) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const start = Date.now();

    const metaStart = Object.fromEntries(
      this.propriedadesReq
        .filter((k) => k in req)
        .map((k) => [k, req[k as keyof Request]]),
    );
    metaStart.path = req.originalUrl;
    metaStart.userId = (req as any).user?.uuid ?? (req as any).user?.id;
    metaStart.userName = (req as any).user?.name;
    metaStart.userLevel = (req as any).user?.access_level;

    this.ioLogger.outLog('info', 'Request started', 'HTTP', metaStart);

    return next.handle().pipe(
      tap((data) => {
        const res = ctx.getResponse<Response>();

        const metaEnd = Object.fromEntries(
          this.propriedadesRes
            .filter((k) => k in res)
            .map((k) => [k, res[k as keyof Response]]),
        );

        const metaFull = {
          ...metaEnd,
          method: req.method,
          path: req.originalUrl,
          durationMs: Date.now() - start,
          userId: (req as any).user?.id ?? (req as any).user?.uuid,
          userName: (req as any).user?.name,
          userLevel: (req as any).user?.access_level,
          response: this.safeOutput(data),
        };

        this.ioLogger.outLog('info', 'Request completed', 'HTTP', metaFull);
      }),

      catchError((err) => {
        const res = ctx.getResponse<Response>();

        const metaEndError = Object.fromEntries(
          this.propriedadesRes
            .filter((k) => k in res)
            .map((k) => [k, res[k as keyof Response]]),
        );

        const metaFullError = {
          ...metaEndError,
          method: req.method,
          path: req.originalUrl,
          statusCode: res.statusCode ?? 500,
          durationMs: Date.now() - start,
          userId: (req as any).user?.uuid ?? (req as any).user?.id,
          userName: (req as any).user?.name,
          userLevel: (req as any).user?.access_level,
          error: {
            message: err?.message,
            stack: err?.stack,
          },
        };

        this.ioLogger.outLog('error', 'Request failed', 'HTTP', metaFullError);

        throw err;
      }),
    );
  }

  private safeOutput(data: any, depth = 2): any {
    if (data === null || data === undefined) return data;

    if (typeof data === 'string') {
      return data.length > 200 ? `${data.slice(0, 200)}...` : data;
    }

    if (typeof data !== 'object') {
      return data;
    }

    if (Array.isArray(data)) {
      if (depth <= 0) return `[Array(${data.length})]`;

      return data.slice(0, 10).map((item) => this.safeOutput(item, depth - 1));
    }

    const result: Record<string, any> = {};
    const sensitiveKeys = [
      'password',
      'token',
      'accessToken',
      'refreshToken',
      'authorization',
      'secret',
      'cookie',
      'jwt',
    ];

    for (const [key, value] of Object.entries(data)) {
      if (
        sensitiveKeys.some((s) => key.toLowerCase().includes(s.toLowerCase()))
      ) {
        result[key] = '[REDACTED]';
        continue;
      }

      if (depth <= 0) {
        result[key] = '[TRUNCATED]';
        continue;
      }

      if (value && typeof value === 'object') {
        result[key] = this.safeOutput(value, depth - 1);
      } else if (typeof value === 'string') {
        result[key] = value.length > 200 ? `${value.slice(0, 200)}...` : value;
      } else {
        result[key] = value;
      }
    }

    return result;
  }
}
