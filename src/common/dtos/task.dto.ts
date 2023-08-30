import {
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { TaskStatus } from '../enums/task.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(15)
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(1500)
  @ApiProperty()
  description: string;

  @IsEnum(TaskStatus)
  @IsNotEmpty()
  @ApiProperty()
  status: TaskStatus;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  target: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  project: string;
}
