import {
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
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
}

export class AddUserToProjectDto {
  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  project: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty()
  target: string;
}
