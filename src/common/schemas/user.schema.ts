import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RightStatus } from '../enums/rights.enum';
import {ApiProperty} from "@nestjs/swagger";

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  @ApiProperty()
  name: string;

  @Prop({ required: true })
  @ApiProperty()
  password: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  })
  @ApiProperty()
  tasks: string[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  })
  @ApiProperty()
  projects: string[];

  @Prop({ required: true })
  @ApiProperty()
  right: RightStatus;

  @Prop({ name: 'refresh_token' })
  @ApiProperty()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
