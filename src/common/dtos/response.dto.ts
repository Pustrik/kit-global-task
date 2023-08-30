import { ApiProperty } from '@nestjs/swagger';
import { User } from '../schemas';

export class ResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: User;
}
