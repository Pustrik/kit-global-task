import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from '../../dtos/user.dto';
import { Project, User, UserDocument } from '../../schemas';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Project.name) private readonly ProjectModel: Model<Project>,
  ) {}

  async create(dto: CreateUserDto): Promise<UserDocument> {
    const createdUser = new this.userModel(dto);
    return createdUser.save();
  }

  async deleteById(user: string) {
    return await this.userModel.deleteOne({ _id: user }).exec();
  }

  async getById(userId: string): Promise<UserDocument> {
    return this.userModel.findOne({ _id: userId }).exec();
  }

  async getByName(name: string): Promise<UserDocument> {
    return this.userModel.findOne({ name }).exec();
  }
  async addProjToUser(userId: string, projId: string) {
    return await this.userModel
      .updateOne(
        {
          _id: userId,
        },
        {
          $push: { projects: projId },
        },
      )
      .exec();
  }

  async addTaskToUser(userId: string, taskId: string) {
    return await this.userModel
      .updateOne(
        {
          _id: userId,
        },
        {
          $push: { tasks: taskId },
        },
      )
      .exec();
  }
}
