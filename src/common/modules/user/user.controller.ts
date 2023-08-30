import { Controller, Delete, Get, Param } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { User, UserDocument } from '../../schemas';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get(':id')
  @ApiTags('Users')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiOkResponse({
    description: 'User retrieved successfully',
    type: User,
  })
  @ApiParam({ name: 'id', description: 'ID of the user to retrieve' })
  @ApiBearerAuth()
  async getUserById(@Param('user') target: string): Promise<UserDocument> {
    return await this.userService.getById(target);
  }

  @Delete('delete/:id')
  @ApiTags('Users')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiOkResponse({
    description: 'User deleted successfully',
  })
  @ApiParam({ name: 'id', description: 'ID of the user to delete' })
  @ApiBearerAuth()
  async deleteUserById(@Param('user') target: string) {
    return await this.userService.deleteById(target);
  }
}
