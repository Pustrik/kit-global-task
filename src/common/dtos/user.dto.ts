import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RightStatus } from '../enums/rights.enum';

export const passwordRegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!\"#$%&'()*+,\-./:;<=>?@\[\\\]^_`{|}~])[a-zA-Z\d!\"#$%&'()*+,\-./:;<=>?@\[\\\]^_`{|}~]{8,}$/;
export const usernameRegExp = /^[a-zA-Z0-9_.-]+$/;

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Matches(usernameRegExp)
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @Matches(passwordRegExp)
  password: string;

  @IsEnum(RightStatus)
  @IsNotEmpty()
  @ApiProperty()
  right: RightStatus;
}

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
