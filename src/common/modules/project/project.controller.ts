import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { GetSubFromToken } from '../../decoraators/get-sub-from-token';
import { TokenType } from '../../enums/token.enum';
import { CreateProjectDto } from '../../dtos/project.dto';
import { CreateTaskDto } from '../../dtos/task.dto';
import { Project, ProjectDocument, Task, TaskDocument } from '../../schemas';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  @ApiTags('Projects')
  @ApiOperation({ summary: 'Create a new project' })
  @ApiCreatedResponse({
    description: 'Project successfully created',
    type: Project,
  })
  @ApiBearerAuth()
  async createProj(
    @GetSubFromToken(TokenType.ACCESS_TOKEN) sub: string,
    @Body() dto: CreateProjectDto,
  ): Promise<ProjectDocument> {
    return await this.projectService.createProj(dto, sub);
  }

  @Get(':proj')
  @HttpCode(HttpStatus.OK)
  @ApiTags('Projects')
  @ApiOperation({ summary: 'Get a specific project' })
  @ApiOkResponse({
    description: 'Project retrieved successfully',
    type: Project,
  })
  @ApiBearerAuth()
  async getProject(
    @GetSubFromToken(TokenType.ACCESS_TOKEN) sub: string,
    @Param('proj') project: string,
  ): Promise<ProjectDocument> {
    return await this.projectService.getProj(project, sub);
  }

  @Delete('delete-proj/:proj')
  @HttpCode(HttpStatus.OK)
  @ApiTags('Projects')
  @ApiOperation({ summary: 'Delete a specific project' })
  @ApiOkResponse({
    description: 'Project deleted successfully',
    type: Project,
  })
  @ApiBearerAuth()
  async deleteProject(
    @GetSubFromToken(TokenType.ACCESS_TOKEN) sub: string,
    @Param('proj') project: string,
  ): Promise<ProjectDocument> {
    return await this.projectService.deleteProj(project, sub);
  }

  @Post('add-user/:proj/:user')
  @HttpCode(HttpStatus.OK)
  @ApiTags('Projects')
  @ApiOperation({ summary: 'Add a user to a specific project' })
  @ApiOkResponse({
    description: 'User added to the project successfully',
    type: Project,
  })
  @ApiBearerAuth()
  async addUserToProj(
    @GetSubFromToken(TokenType.ACCESS_TOKEN) sub: string,
    @Param('proj') project: string,
    @Param('user') target: string,
  ): Promise<ProjectDocument> {
    return await this.projectService.addUserToProj({ project, target }, sub);
  }

  @Delete('delete-user/:proj/:user')
  @HttpCode(HttpStatus.OK)
  @ApiTags('Projects')
  @ApiOperation({ summary: 'Deletes a user from a specific project' })
  @ApiOkResponse({
    description: 'User removed from the project successfully',
    type: Project,
  })
  @ApiBearerAuth()
  async deleteUserFormProj(
    @GetSubFromToken(TokenType.ACCESS_TOKEN) sub: string,
    @Param('proj') project: string,
    @Param('user') target: string,
  ): Promise<ProjectDocument> {
    return await this.projectService.deleteUserFromProj(project, target, sub);
  }

  @Post('add-task')
  @HttpCode(HttpStatus.CREATED)
  @ApiTags('Tasks')
  @ApiOperation({ summary: 'Add a task' })
  @ApiCreatedResponse({
    description: 'Task successfully added',
    type: Task,
  })
  @ApiBearerAuth()
  async addTask(
    @GetSubFromToken(TokenType.ACCESS_TOKEN) sub: string,
    @Body() dto: CreateTaskDto,
  ): Promise<TaskDocument> {
    return await this.projectService.addTaskToProj(dto, sub);
  }

  @Delete('delete-task/:proj/:id')
  @HttpCode(HttpStatus.OK)
  @ApiTags('Tasks')
  @ApiOperation({ summary: 'Deletes a task from a specific project' })
  @ApiOkResponse({
    description: 'Task removed from the project successfully',
    type: Project,
  })
  @ApiBearerAuth()
  async deleteTaskFromProject(
    @GetSubFromToken(TokenType.ACCESS_TOKEN) sub: string,
    @Param('proj') project: string,
    @Param('id') task: string,
  ): Promise<ProjectDocument> {
    return await this.projectService.deleteTask(task, project, sub);
  }

  @Get('tasks/:proj/:user')
  @HttpCode(HttpStatus.OK)
  @ApiTags('Tasks')
  @ApiOperation({ summary: 'Get tasks for a user in a specific project' })
  @ApiOkResponse({
    description: 'Tasks retrieved successfully',
    type: [Task],
  })
  @ApiBearerAuth()
  async getProjTasks(
    @Param('proj') project: string,
    @Param('user') user: string,
  ): Promise<TaskDocument[]> {
    return await this.projectService.getProjUsersTask(project, user);
  }
}
