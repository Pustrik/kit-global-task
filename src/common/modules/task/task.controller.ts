import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { Task, TaskDocument} from '../../schemas';
import { GetSubFromToken } from '../../decoraators/get-sub-from-token';
import { TokenType } from '../../enums/token.enum';
import { TaskStatus } from '../../enums/task.enum';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiTags('Tasks')
  @ApiOperation({ summary: 'Retrieve a task by ID' })
  @ApiOkResponse({
    description: 'Task retrieved successfully',
    type: Task,
  })
  @ApiParam({ name: 'id', description: 'ID of the task to retrieve' })
  @ApiBearerAuth()
  async getTask(@Param('id') task: string): Promise<TaskDocument> {
    return await this.taskService.getTask(task);
  }

  @Patch('change-status/:status/:id')
  @HttpCode(HttpStatus.OK)
  @ApiTags('Tasks')
  @ApiOperation({ summary: 'Change the status of a task' })
  @ApiOkResponse({
    description: 'Task status updated successfully',
    type: Task,
  })
  @ApiParam({ name: 'id', description: 'ID of the task to update' })
  @ApiParam({ name: 'status', description: 'New status for the task' })
  @ApiBearerAuth()
  async changeStatus(
    @GetSubFromToken(TokenType.ACCESS_TOKEN) sub: string,
    @Param('id') task: string,
    @Param('status') status: string,
  ): Promise<TaskDocument> {
    return await this.taskService.changeStatus(<TaskStatus>status, task, sub);
  }
}
