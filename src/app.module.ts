import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './common/modules/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './common/modules/auth/auth.module';
import { AtGuard } from './common/guards/at.guard';
import { APP_GUARD } from '@nestjs/core';
import { ProjectModule } from './common/modules/project/project.module';
import { TaskModule } from './common/modules/task/task.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: './.env' }),
    UserModule,
    AuthModule,
    ProjectModule,
    TaskModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Если ваш ConfigService находится в отдельном модуле
      useFactory: async (configService: ConfigService) => {
        const mongoUrl = configService.get<string>('MONGO_URL');
        return {
          uri: mongoUrl,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
