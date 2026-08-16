import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class IoLogger extends Logger {
  /**
   * Creates an instance of IoLogger.
   * @param {string} context
   * @memberof IoLogger
   */
  constructor(context = IoLogger.name) {
    super(context);
  }

  public outLog(
    level: 'info' | 'warn' | 'error' | 'debug',
    message: string,
    context?: string,
    meta?: Record<string, any>,
  ) {
    const safeMeta = this.sanitize(meta);

    switch (level) {
      case 'debug':
        this.debug(message, context ?? IoLogger.name, safeMeta);
        break;
      case 'error':
        this.error(message, context ?? IoLogger.name, safeMeta);
        break;
      case 'info':
        this.log(message, context ?? IoLogger.name, safeMeta);
        break;
      case 'warn':
        this.warn(message, context ?? IoLogger.name, safeMeta);
        break;
    }
  }

  private sanitize(data?: Record<string, any>) {
    if (!data || typeof data !== 'object') return data;

    // Se for um array, sanitiza cada item
    if (Array.isArray(data)) return data.map((item) => this.sanitize(item));

    const clone = { ...data };
    const chavesSensiveis = [
      'pass',
      'user_uuid',
      'twoFacSecret',
      'uuid',
      'token',
      'cookies',
      'secret',
    ];

    for (const key of Object.keys(clone)) {
      if (chavesSensiveis.includes(key)) {
        clone[key] = '[REDACTED]';
      } else if (typeof clone[key] === 'object') {
        clone[key] = this.sanitize(clone[key]);
      }
    }
    return clone;
  }
}
