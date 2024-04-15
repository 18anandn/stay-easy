import { UtilsService } from './../utils/utils.service';
import {
  CanActivate,
  ExecutionContext,
  UseGuards,
  Injectable,
  BadRequestException,
  HttpException,
  ForbiddenException,
  applyDecorators,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { JwtAuthGuard } from '../user/guards/jwt.authguard';
import { assertHasUser } from '../user/assertHasUser';
import { UserRole } from '../user/enums/UserRole.enum';

type AuthOptions = {
  passthrough?: boolean;
};

type AuthOptionsWithRoles = {
  allowedRoles?: UserRole[];
} & AuthOptions;

@Injectable()
class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private utilsService: UtilsService,
  ) {}

  matchRoles(roles: UserRole[], userRole: UserRole) {
    return roles.some((role) => role === userRole);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    try {
      assertHasUser(req);
      const currentUser = req.user.data;
      const classOptions = this.reflector.get<AuthOptionsWithRoles | undefined>(
        'roles',
        context.getClass(),
      );
      const handlerOptions = this.reflector.get<
        AuthOptionsWithRoles | undefined
      >('roles', context.getHandler());

      const { role } = currentUser;

      let allowedRoles: UserRole[] = [];
      if (classOptions && classOptions.allowedRoles) {
        allowedRoles = [...allowedRoles, ...classOptions.allowedRoles];
      }
      if (handlerOptions && handlerOptions.allowedRoles) {
        allowedRoles = [...allowedRoles, ...handlerOptions.allowedRoles];
      }

      if (allowedRoles.length === 0) {
        return true;
      }

      if (!this.matchRoles(allowedRoles, role)) {
        throw new ForbiddenException('Unauthorized to access route');
      }

      return true;
    } catch (error) {
      // if (error instanceof UnauthorizedException) {
      //   const res = context.switchToHttp().getResponse();
      //   this.utilsService.removeTokenFromCookes(res);
      //   throw error;
      // }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException('Invalid cookies');
    }
  }
}

export function AuthGuard(
  allowedRoles?: UserRole[],
  authOptions?: AuthOptions,
) {
  const authOptionsWithRoles: AuthOptionsWithRoles = {
    allowedRoles,
    ...authOptions,
  };
  return applyDecorators(
    SetMetadata('roles', authOptionsWithRoles),
    JwtAuthGuard(),
    UseGuards(RolesGuard),
  );
}
