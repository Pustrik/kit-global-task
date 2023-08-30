import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import swagger from './swagger/swagger';
import { RequestInterceptor } from './common/interceptors/request.iterceptor';
import { AllExceptionFilter } from './common/exceptions';
import { ValidationConfig } from './common/config/validation.config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = await app.get(ConfigService);
  const port = config.get<number>('API_PORT');
  swagger(app);
  app.use(cookieParser());
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new RequestInterceptor());
  app.useGlobalPipes(new ValidationPipe(new ValidationConfig()));
  await app.listen(port || 3000, () => {
    Logger.log(`App started on port: ${port}`);
  });
}
bootstrap();
