import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
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
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Task.name, schema: TaskSchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
