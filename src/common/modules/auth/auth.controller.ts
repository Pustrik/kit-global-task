import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from '../../dtos/user.dto';
import { GetSubFromToken } from '../../decoraators/get-sub-from-token';
import { Public } from '../../decoraators/public.decorator';
import { RtGuard } from '../../guards/rt.guard';
import { Cookie } from '../../decoraators/cookie.decorator';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseDto } from '../../dtos/response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiTags('Authentication')
  @ApiOperation({ summary: 'Signup for a new user' })
  @ApiCreatedResponse({
    description:
      'User registered successfully, refresh token written in cookie.',
    type: ResponseDto,
  })
  async signup(
    @Body() dto: CreateUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    return this.authService.signup(dto, res);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiTags('Authentication')
  @ApiOperation({ summary: 'Login using local strategy' })
  @ApiOkResponse({
    description: 'Logged in successfully, refresh token written in cookie.',
    type: ResponseDto,
  })
  loginLocal(
    @Body() dto: LoginUserDto,
    @Res() res: Response,
  ): Promise<Response> {
    return this.authService.login(dto, res);
  }

  @Post('logout')
  @ApiTags('Authentication')
  @ApiOperation({ summary: 'Logout the user' })
  @ApiOkResponse({
    description: 'Logged out successfully, refresh token erased from cookie',
  })
  @ApiBearerAuth()
  logout(
    @GetSubFromToken('refreshToken') userId: string,
    @Res() res: Response,
  ): Promise<Response> {
    return this.authService.logout(userId, res);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiTags('Authentication')
  @ApiOperation({ summary: 'Refresh the authentication tokens' })
  @ApiOkResponse({
    description:
      'Tokens refreshed successfully, refresh token written in cookie',
    type: ResponseDto,
  })
  refresh(
    @Cookie('refreshToken') refreshToken: string,
    @GetSubFromToken('refreshToken') userId: string,
    @Res() res: Response,
  ): Promise<Response> {
    return this.authService.refreshTokens(userId, refreshToken, res);
  }
}
