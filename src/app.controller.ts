import { Controller, Get, HttpCode } from '@nestjs/common';
export const healthCheckRoute = '/health';
export const faviconRoute = '/favicon.ico';
@Controller()
export class AppController {
  @Get(healthCheckRoute)
  @HttpCode(200)
  healthCheck() {
    return 'Success';
  }

  @Get(faviconRoute)
  @HttpCode(200)
  favicon() {
    return '';
  }
}
