import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { TaskStatus } from '../enums/task.enum';
import {ApiProperty} from "@nestjs/swagger";

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true, unique: true })
  @ApiProperty()
  title: string;

  @Prop({ required: true })
  @ApiProperty()
  description: string;

  @Prop({ required: true })
  @ApiProperty()
  status: TaskStatus;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  })
  @ApiProperty()
  project: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  @ApiProperty()
  target: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  @ApiProperty()
  owner: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
