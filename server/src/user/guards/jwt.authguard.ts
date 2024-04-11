import { ExecutionContext, Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UtilsService } from '../../utils/utils.service';
import { Request } from 'express';

@Injectable()
class JwtAuthGuardClass extends AuthGuard('jwt') {
  constructor(private readonly utilsService: UtilsService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    if (!req.user) await super.canActivate(context);
    return true;
  }

  // handleRequest(
  //   err: any,
  //   user: any,
  //   info: any,
  //   context: ExecutionContext,
  //   status?: any,
  // ) {
  //   console.log('user', user);
  //   console.log('info', info);
  //   if (err) {
  //     if (err instanceof HttpException) throw err;
  //     throw new UnauthorizedException();
  //   }
  //   if (info instanceof UnauthorizedException) {
  //     const res = context.switchToHttp().getResponse();
  //     this.utilsService.removeTokenFromCookes(res);
  //     throw info;
  //   }
  //   return { data: user } as any;
  // }
}

export const JwtAuthGuard = () => UseGuards(JwtAuthGuardClass);
