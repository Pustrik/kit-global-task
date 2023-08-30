import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { TokenType } from '../enums/token.enum';

export const GetSubFromToken = createParamDecorator(
  (key: TokenType, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    let payload;
    if (key == TokenType.REFRESH_TOKEN)
      payload = key in request.cookies ? request.cookies[key] : null;
    else
      payload =
        'authorization' in request.headers
          ? request.headers['authorization']
          : null;

    if (payload) return <string>jwt.decode(payload.split(' ')[1]).sub;
    return null;
  },
);
