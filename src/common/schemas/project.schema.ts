import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import {ApiProperty} from "@nestjs/swagger";

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true, unique: true })
  @ApiProperty()
  title: string;

  @Prop({ required: true })
  @ApiProperty()
  description: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }] })
  @ApiProperty()
  tasks: string[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  @ApiProperty()
  participants: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @ApiProperty()
  owner: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
