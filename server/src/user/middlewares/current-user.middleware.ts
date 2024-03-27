import { UserService } from '../user.service';
import { UtilsService } from '../../utils/utils.service';
import {
  BadRequestException,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { CurrentUserDto } from '../dtos/current-user.dto';
import { NextFunction, Request, Response } from 'express';

// declare module 'express' {
//   export interface Request {
//     user: CurrentUserDto;
//   }
// }

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private userService: UserService,
    private utilsService: UtilsService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { token } = req.signedCookies;
    if (token) {
      try {
        const { userId: id } = await this.utilsService.isTokenValid(token);
        const user = await this.userService.findById(id);
        if (!user) {
          throw new Error('No user found');
        }
        const { id: userId, email, role } = user;
        req.user = { userId, email, role };
      } catch (error) {
        res.cookie('token', null, {
          path: '/',
          expires: new Date(Date.now()),
        });
        throw new BadRequestException('Invalid cookies');
      }
    }
    next();
  }
}
