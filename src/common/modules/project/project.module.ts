import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { TaskModule } from '../task/task.module';
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
    UserModule,
    TaskModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Task.name, schema: TaskSchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
