import {
  CanActivate,
  ExecutionContext,
  UseGuards,
  UnauthorizedException,
  Injectable,
  Inject,
  BadRequestException,
  HttpException,
  ForbiddenException,
  applyDecorators,
  SetMetadata,
} from '@nestjs/common';
import { ValidRoles } from '../user/user.entity';
import { Reflector } from '@nestjs/core';
import { UtilsService } from '../utils/utils.service';
import { Request } from 'express';
import { AuthService } from '../user/auth.service';

type AuthOptions = {
  passthrough?: boolean;
};

type AuthOptionsWithRoles = {
  allowedRoles?: ValidRoles[];
} & AuthOptions;

@Injectable()
class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
    private utilsService: UtilsService,
  ) {}

  matchRoles(roles: ValidRoles[], userRole: ValidRoles) {
    return roles.some((role) => role === userRole);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    if (!req.user) {
      // console.log('here');
      const user = await this.authService.getUserFromCookie(req);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      req.user = user;
    }
    try {
      const classOptions = this.reflector.get<AuthOptionsWithRoles | undefined>(
        'roles',
        context.getClass(),
      );
      const handlerOptions = this.reflector.get<
        AuthOptionsWithRoles | undefined
      >('roles', context.getHandler());

      const currentUser = req.user;
      if (!classOptions || !handlerOptions) {
        return true;
      }

      const { role } = currentUser;

      let allowedRoles: ValidRoles[] = [];
      if (classOptions.allowedRoles) {
        allowedRoles = [...allowedRoles, ...classOptions.allowedRoles];
      }
      if (handlerOptions.allowedRoles) {
        allowedRoles = [...allowedRoles, ...handlerOptions.allowedRoles];
      }

      if (allowedRoles.length === 0) {
        return true;
      }

      if (!this.matchRoles(allowedRoles, role)) {
        // console.log('here');
        throw new ForbiddenException('Unauthorized to access route');
      }

      return true;
    } catch (error) {
      const res = context.switchToHttp().getResponse();
      this.utilsService.removeTokenFromCookes(res);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('Invalid cookies');
    }
  }
}

export function AuthGuard(
  allowedRoles?: ValidRoles[],
  authOptions?: AuthOptions,
) {
  const authOptionsWithRoles: AuthOptionsWithRoles = {
    allowedRoles,
    ...authOptions,
  };
  return applyDecorators(
    SetMetadata('roles', authOptionsWithRoles),
    UseGuards(RolesGuard),
  );
}
