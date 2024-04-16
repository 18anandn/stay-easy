import { ExecutionContext, Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard, IAuthModuleOptions } from '@nestjs/passport';

@Injectable()
class GoogleAuthGuardClass extends AuthGuard('google') {
  async canActivate(context: ExecutionContext) {
    const activate = (await super.canActivate(context)) as boolean;
    // const request = context.switchToHttp().getRequest();
    // await super.logIn(request);
    return activate;
  }
}

@Injectable()
class GoogleOptionalAuthGuardClass extends AuthGuard('google') {
  handleRequest<TUser = any>(
    err: any,
    user: any,
    info: any,
    context: ExecutionContext,
    status?: any,
  ): TUser {
    return user;
  }
}

export const GoogleAuthGuard = () => UseGuards(GoogleAuthGuardClass);
export const GoogleOptionalAuthGuard = () =>
  UseGuards(GoogleOptionalAuthGuardClass);
