import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Cookie = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const payload = key in request.cookies ? request.cookies[key] : null;
    if (payload) return <string>payload.split(' ')[1];
    return null;
  },
);
