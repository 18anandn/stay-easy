import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { CurrentUserDto } from '../dtos/current-user.dto';

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext): CurrentUserDto => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  },
);
