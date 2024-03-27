import {
  ExecutionContext,
  UnauthorizedException,
  createParamDecorator,
} from '@nestjs/common';
import { CurrentUserDto } from '../dtos/current-user.dto';
import { Request } from 'express';

declare global {
  namespace Express {
    export interface Request {
      user?: CurrentUserDto;
    }
  }
}

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext): CurrentUserDto => {
    const req: Request = context.switchToHttp().getRequest();
    if (!req.user) {
      throw new UnauthorizedException('Login to continue');
    }
    return req.user;
  },
);
