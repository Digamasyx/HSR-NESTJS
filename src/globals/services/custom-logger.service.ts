import { Injectable, ConsoleLogger } from '@nestjs/common';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  logRequest(method: string, url: string, body: any) {
    this.log(`Request: ${method} ${url}`);
    this.debug(`Body: ${JSON.stringify(body)}`);
  }

  logResponse(method: string, url: string, response: any, duration: number) {
    this.log(`Response: ${method} ${url} - ${duration}ms`);
    this.debug(`Response Body: ${JSON.stringify(response)}`);
  }
}
