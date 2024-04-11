import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

type RequestWithUser = Request & {
  user: {
    data: Express.UserDataInRequest;
  };
};
export function assertHasUser(req: Request): asserts req is RequestWithUser {
  if (!req.user) throw new UnauthorizedException();
}
