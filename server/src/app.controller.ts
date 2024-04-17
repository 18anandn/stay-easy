import { UtilsService } from './utils/utils.service';
import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { AuthService } from './user/auth.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private utilsService: UtilsService,
    private authService: AuthService,
  ) {}

  // @Get('/')
  // serveUserReactApp(@Res() response: Response) {
  //   console.log(join(process.cwd(), 'front-end'));
  //   response.sendFile('index.html', { root: join(process.cwd(), 'front-end') });
  // }

  @Get('/logout')
  logoutUser(@Res() res: Response) {
    this.utilsService.removeTokenFromCookes(res);
    res.redirect(this.utilsService.mainURL);
  }

  @Get('/owner')
  async redirectToOwnerPage(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.authService.getUserFromCookie(req, res);
    if (user) {
      res
        .status(HttpStatus.PERMANENT_REDIRECT)
        .redirect(this.utilsService.ownerURL);
      return;
    }
    res
      .status(HttpStatus.TEMPORARY_REDIRECT)
      .redirect(this.utilsService.authURL + '/login');
  }

  @Get('/admin')
  async redirectToAdminPage(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = await this.authService.getUserFromCookie(req, res);
    if (user) {
      res
        .status(HttpStatus.PERMANENT_REDIRECT)
        .redirect(this.utilsService.adminURL);
      return;
    }
    res
      .status(HttpStatus.TEMPORARY_REDIRECT)
      .redirect(this.utilsService.authURL + '/login');
  }
}
