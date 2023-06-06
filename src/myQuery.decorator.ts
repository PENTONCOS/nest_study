import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const MyQuery = createParamDecorator(
  (key: string, ctx: ExecutionContext) => { // key 是传入的参数，而 ExecutionContext 可以取出 request、response 对象。
    const request: Request = ctx.switchToHttp().getRequest();
    return request.query[key];
  },
);

