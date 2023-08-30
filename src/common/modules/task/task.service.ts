import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from '../user/user.service';
import { CreateTaskDto } from '../../dtos/task.dto';
import { TaskStatus } from '../../enums/task.enum';
import {
  Project,
  ProjectDocument,
  Task,
  TaskDocument,
  User,
} from '../../schemas';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    private readonly userService: UserService,
  ) {}

  async create(
    dto: CreateTaskDto,
    owner: string,
    project: ProjectDocument,
  ): Promise<TaskDocument> {
    const task = new this.taskModel({ ...dto, owner });
    await task.save();
    project.tasks.push(task.id);
    await project.save();
    await this.userService.addTaskToUser(dto.target, task.id);
    return task;
  }

  async delete(taskId: string, sub: string) {
    const task = await this.getTask(taskId);
    if (task.owner.toString() != sub && task.target.toString() != sub)
      throw new ForbiddenException('U have not access to this task.');
    await this.userModel
      .updateOne({ _id: task.owner }, { $pull: { tasks: taskId } })
      .exec();
    await this.userModel
      .updateOne({ _id: task.target }, { $pull: { tasks: taskId } })
      .exec();
    await task.deleteOne();
  }

  async deleteWithoutCheck(taskId: string) {
    const task = await this.taskModel.findOne({ _id: taskId });
    await this.userModel
      .updateOne({ _id: task.owner }, { $pull: { tasks: taskId } })
      .exec();
    await this.userModel
      .updateOne({ _id: task.target }, { $pull: { tasks: taskId } })
      .exec();
    await task.deleteOne();
  }

  async changeStatus(
    status: TaskStatus,
    taskId: string,
    sub: string,
  ): Promise<TaskDocument> {
    const task = await this.getTask(taskId);
    if (task.owner != sub || task.target != sub)
      throw new ForbiddenException('U have not access to this task.');
    task.status = status;
    return await task.save();
  }

  async getTask(task: string): Promise<TaskDocument> {
    return await this.taskModel.findOne({ _id: task }).exec();
  }
}
