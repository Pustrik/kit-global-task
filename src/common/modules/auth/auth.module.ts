import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AtStrategy } from './strategies/at.strategy';
import { RtStrategy } from './strategies/rt.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Project,
  ProjectSchema,
  Task,
  TaskSchema,
  User,
  UserSchema,
} from '../../schemas';

@Module({
  imports: [
    JwtModule.register({}),
    UserModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Task.name, schema: TaskSchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy],
})
export class AuthModule {}
