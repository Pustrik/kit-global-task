import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { faviconRoute, healthCheckRoute } from '../../app.controller';

export class RequestInterceptor implements NestInterceptor {
  private logger = new Logger('HTTP');
  private excludePaths = [healthCheckRoute, faviconRoute];

  async intercept(context: ExecutionContext, next: CallHandler) {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest();

    if (this.excludePaths.includes(req.originalUrl)) {
      return next.handle();
    }
    this.logger.log(`${req.method} ${req.originalUrl}`);
    if (req.method !== 'GET') {
      this.logger.log(req.body);
    }
    return next.handle();
  }
}
