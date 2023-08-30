import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compareStrings, hashString } from '../../helpers/crypt.helper';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, LoginUserDto } from '../../dtos/user.dto';
import { UserService } from '../user/user.service';
import { JwtPayload } from './strategies/at.strategy';
import { Response } from 'express';
import { User, UserDocument } from '../../schemas';

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

const REFRESH_TOKEN = 'refreshToken';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async signup(dto: CreateUserDto, res: Response): Promise<Response> {
    dto.password = await hashString(dto.password);
    const user: UserDocument = await this.userService.create(dto);
    const tokens: Tokens = await this.getTokens(user.id, user.name);
    await this.updateRtHash(user.id, tokens.refreshToken);

    return this.setRefreshTokenToCookies(tokens, user, res);
  }

  async login(dto: LoginUserDto, res: Response): Promise<Response> {
    const user = await this.userModel.findOne({ name: dto.name });
    if (!user) throw new ForbiddenException('Access Denied');

    const passwordMatches = await compareStrings(user.password, dto.password);

    if (!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.name);
    console.log(tokens.refreshToken);
    await this.updateRtHash(user.id, tokens.refreshToken);

    return this.setRefreshTokenToCookies(tokens, user, res);
  }

  async logout(userId: string, res: Response): Promise<Response> {
    await this.userModel
      .updateOne(
        {
          _id: userId,
        },
        {
          $set: { refreshToken: null },
        },
      )
      .exec();
    return res.clearCookie('refreshToken').status(HttpStatus.OK).json(true);
  }

  async refreshTokens(
    userId: string,
    rt: string,
    res: Response,
  ): Promise<Response> {
    const user = await this.userModel.findOne({ _id: userId });

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const rtMatches = await compareStrings(user.refreshToken, rt);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.name);
    await this.updateRtHash(user.id, tokens.refreshToken);

    return this.setRefreshTokenToCookies(tokens, user, res);
  }

  async updateRtHash(userId: number, rt: string): Promise<void> {
    const hash = await hashString(rt);
    await this.userModel
      .updateOne(
        {
          _id: userId,
        },
        {
          $set: { refreshToken: hash },
        },
      )
      .exec();
  }

  async getTokens(userId: number, name: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      name: name,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('AT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('RT_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }

  private setRefreshTokenToCookies(
    tokens: Tokens,
    user: UserDocument,
    res: Response,
  ): Response {
    if (!tokens) {
      throw new UnauthorizedException();
    }
    return res
      .status(HttpStatus.CREATED)
      .cookie(REFRESH_TOKEN, 'Bearer ' + tokens.refreshToken, {
        httpOnly: true,
      })
      .json({ accessToken: 'Bearer ' + tokens.accessToken, user: user });
  }
}
