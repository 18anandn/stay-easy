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
import { join } from 'path';
import { AuthService } from './user/auth.service';
import { UserRoleEnum } from './user/UserRole.enum';

@Controller()
export class AppController {
  readonly mainURL!: string;
  readonly authURL!: string;
  readonly ownerURL!: string;
  readonly adminURL!: string;

  constructor(
    private readonly appService: AppService,
    private utilsService: UtilsService,
    private authService: AuthService,
  ) {
    this.mainURL = `http://www.${this.utilsService.getDomainName()}`;
    this.authURL = `http://auth.${this.utilsService.getDomainName()}/login`;
    this.adminURL = `http://admin.${this.utilsService.getDomainName()}`;
    this.ownerURL = `http://owner.${this.utilsService.getDomainName()}`;
  }

  // @Get('/')
  // serveUserReactApp(@Res() response: Response) {
  //   console.log(join(process.cwd(), 'front-end'));
  //   response.sendFile('index.html', { root: join(process.cwd(), 'front-end') });
  // }

  @Get('/auth')
  async redirectToAuthPage(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('redirectTo') redirectTo: string | undefined,
  ) {
    let redirectUrl = new URL(this.authURL);
    const user = await this.authService.getUserFromCookie(req);
    if (!user) {
      if (redirectTo) {
        redirectUrl.searchParams.set('redirectTo', redirectTo);
        res
          .status(HttpStatus.TEMPORARY_REDIRECT)
          .redirect(redirectUrl.toString());
        return;
      }
    }
    if (redirectTo && URL.canParse(redirectTo)) {
      redirectUrl = new URL(redirectTo);
      if (!redirectUrl.hostname.endsWith(this.utilsService.domain_name)) {
        redirectUrl = new URL(this.mainURL);
      }
    } else {
      redirectUrl = new URL(this.mainURL);
    }
    res.status(HttpStatus.PERMANENT_REDIRECT).redirect(redirectUrl.toString());
  }

  @Get('/logout')
  logoutUser(@Res({ passthrough: true }) res: Response) {
    this.utilsService.removeTokenFromCookes(res);
    res.redirect(this.mainURL);
  }

  @Get('/owner')
  async redirectToOwnerPage(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.getUserFromCookie(req);
    if (
      user &&
      (user.role === UserRoleEnum.OWNER || user.role === UserRoleEnum.ADMIN)
    ) {
      res.status(HttpStatus.PERMANENT_REDIRECT).redirect(this.ownerURL);
      return;
    }
    res.status(HttpStatus.TEMPORARY_REDIRECT).redirect(this.authURL);
  }

  @Get('/admin')
  async redirectToAdminPage(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.getUserFromCookie(req);
    if (user && user.role === UserRoleEnum.ADMIN) {
      res.status(HttpStatus.PERMANENT_REDIRECT).redirect(this.adminURL);
      return;
    }
    res.status(HttpStatus.TEMPORARY_REDIRECT).redirect(this.authURL);
  }
}
