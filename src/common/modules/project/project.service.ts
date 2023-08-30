import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddUserToProjectDto, CreateProjectDto } from '../../dtos/project.dto';
import { UserService } from '../user/user.service';
import { TaskService } from '../task/task.service';
import { CreateTaskDto } from '../../dtos/task.dto';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '../../exceptions';
import {
  Project,
  ProjectDocument,
  Task,
  TaskDocument,
  User,
} from '../../schemas';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    private readonly userService: UserService,
    private readonly taskService: TaskService,
  ) {}

  async createProj(
    dto: CreateProjectDto,
    owner: string,
  ): Promise<ProjectDocument> {
    const project = new this.projectModel({
      ...dto,
      participants: [owner],
      owner: owner,
    });
    await project.save();
    await this.userService.addProjToUser(owner, project.id);
    return project;
  }

  async deleteProj(project: string, owner: string): Promise<ProjectDocument> {
    const isProject = await this.getProjById(project);

    if (isProject.owner != owner)
      throw new ForbiddenException('You are not the owner.');

    isProject.tasks.forEach((task) => {
      this.taskService.deleteWithoutCheck(task);
    });

    for (const part of isProject.participants) {
      await this.userModel
        .updateOne({ _id: part }, { $pull: { projects: isProject._id } })
        .exec();
    }

    return isProject.deleteOne();
  }
  async getProj(projId: string, owner: string): Promise<ProjectDocument> {
    const proj = await this.projectModel.findOne({ _id: projId });
    if (!proj.participants.includes(owner))
      throw new ForbiddenException('U r not a part of the proj');
    return proj;
  }
  async getProjById(projId: string): Promise<ProjectDocument> {
    return this.projectModel.findOne({ _id: projId });
  }

  async addUserToProj(
    dto: AddUserToProjectDto,
    owner: string,
  ): Promise<ProjectDocument> {
    const isProject = await this.getProj(dto.project, owner);

    if (isProject.participants.includes(dto.target))
      throw new ConflictException('Already in');

    if (isProject.owner != owner)
      throw new ForbiddenException('U r not the owner');

    isProject.participants.push(dto.target);
    await this.userService.addProjToUser(dto.target, dto.project);
    return await isProject.save();
  }
  async addTaskToProj(
    dto: CreateTaskDto,
    owner: string,
  ): Promise<TaskDocument> {
    const isProject = await this.getProj(dto.project, owner);
    if (!isProject.participants.includes(dto.target))
      throw new NotFoundException('No such user in proj');

    return await this.taskService.create(dto, owner, isProject);
  }

  async deleteTask(
    task: string,
    project: string,
    owner: string,
  ): Promise<ProjectDocument> {
    const isProject = await this.getProj(project, owner);
    console.log('1');
    if (!isProject.tasks.includes(task))
      throw new NotFoundException('Task does not exist.');

    await this.taskService.delete(task, owner);

    isProject.tasks = isProject.tasks.filter((ts) => ts != task);
    return await isProject.save();
  }

  async deleteUserFromProj(project: string, target: string, owner: string) {
    const isProject = await this.getProj(project, owner);

    if (isProject.owner != owner)
      throw new ForbiddenException('U r not the owner');

    isProject.participants = isProject.participants.filter(
      (user) => user != target,
    );

    const user = await this.userService.getById(target);
    user.projects = user.projects.filter((proj) => proj != project);
    user.tasks = user.tasks.filter((task) => !isProject.tasks.includes(task));
    user.save();

    for (const task of isProject.tasks)
      await this.taskModel
        .updateOne({ _id: task }, { $set: { target: owner } })
        .exec();

    return isProject.save();
  }

  async getProjUsersTask(projectId: string, userId: string) {
    const proj = await this.getProjById(projectId);
    const user = await this.userService.getById(userId);
    const tasks = proj.tasks.filter((task) => user.tasks.includes(task));
    const taskMas: TaskDocument[] = [];
    for (const task of tasks)
      taskMas.push(await this.taskService.getTask(task));
    return taskMas;
  }
}
