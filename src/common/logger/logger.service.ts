import { Injectable, ConsoleLogger } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class LoggerService extends ConsoleLogger {
  constructor(private readonly cls: ClsService) {
    super();
  }

  private getRequestId(): string {
    const requestId = this.cls.getId();
    return requestId ? `[${requestId}]` : '';
  }

  log(message: string, context?: string) {
    const requestId = this.getRequestId();
    super.log(`${requestId} ${message}`, context);
  }

  error(message: string, trace?: string, context?: string) {
    const requestId = this.getRequestId();
    super.error(`${requestId} ${message}`, trace, context);
  }

  warn(message: string, context?: string) {
    const requestId = this.getRequestId();
    super.warn(`${requestId} ${message}`, context);
  }

  debug(message: string, context?: string) {
    const requestId = this.getRequestId();
    super.debug(`${requestId} ${message}`, context);
  }

  verbose(message: string, context?: string) {
    const requestId = this.getRequestId();
    super.verbose(`${requestId} ${message}`, context);
  }
}
