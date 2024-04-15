import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { assertHasUser } from '../assertHasUser';
import { UserRole } from '../enums/UserRole.enum';

declare global {
  namespace Express {
    interface User {
      data?: UserDataInRequest;
    }

    interface UserDataInRequest {
      id: string;
      email: string;
      role: UserRole;
    }
  }
}

export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext): Express.UserDataInRequest => {
    const req: Request = context.switchToHttp().getRequest();
    assertHasUser(req);
    return req.user.data;
  },
);
