import {
  CanActivate,
  ExecutionContext,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ValidRoles } from '../user/user.entity';

// interface RolesOptions {
//   values?: string[];
//   onlyForCurrentUser: boolean;
// }

// @Injectable()
// class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const roles = this.reflector.get(Roles, context.getHandler());
//     if (!roles || !roles.values) {
//       return true;
//     }
//     console.log('here')
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;
//     return true
//   }
// }

// export function RoleGuard(roles?: RolesOptions) {
//   return UseGuards(RolesGuard())
// }

export function AuthGuard(allowedRoles?: ValidRoles[]) {
  class RolesGuard implements CanActivate {
    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const request = context.switchToHttp().getRequest();

      const { user } = request;
      if (user && (!allowedRoles || allowedRoles.includes(user.role))) {
        return true;
      }

      throw new UnauthorizedException('Unauthorized action');
    }
  }

  return UseGuards(RolesGuard);
}
