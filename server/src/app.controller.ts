import { UtilsService } from './utils/utils.service';
import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { join } from 'path';
import { UserRole } from './user/user.entity';
import { AuthService } from './user/auth.service';

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
    @Res() res: Response,
    @Query('redirectTo') redirectTo: string | undefined,
  ) {
    const user = await this.authService.getUserFromCookie(req);
    if (user) {
      let redirectToURL = this.mainURL;
      if (redirectTo && URL.canParse(redirectTo)) {
        redirectToURL = redirectTo;
      }
      res.redirect(redirectToURL);
      return;
    }
    res.redirect(this.authURL);
  }

  @Get('/logout')
  logoutUser(@Res() res: Response) {
    console.log('here');
    this.utilsService.removeTokenFromCookes(res);
    res.redirect(this.mainURL);
  }

  @Get('/owner')
  async redirectToOwnerPage(
    @Req() req: Request,
    @Res() res: Response,
    @Query('redirectTo') redirectTo: string,
  ) {
    const user = await this.authService.getUserFromCookie(req);
    if (
      !user ||
      !(user.role === UserRole.OWNER || user.role === UserRole.ADMIN)
    ) {
      const redirectToUrl = new URL(this.authURL);
      redirectToUrl.searchParams.set(
        'redirectTo',
        new URL(redirectTo, this.ownerURL).toString(),
      );
      res.redirect(redirectToUrl.toString());
      return;
    }
    res.redirect(this.ownerURL);
  }

  @Get('/admin')
  async redirectToAdminPage(
    @Req() req: Request,
    @Res() res: Response,
    @Query('redirectTo') redirectTo: string,
  ) {
    const user = await this.authService.getUserFromCookie(req);
    if (!user || user.role !== UserRole.ADMIN) {
      const redirectToUrl = new URL(this.authURL);
      redirectToUrl.searchParams.set(
        'redirectTo',
        new URL(redirectTo, this.adminURL).toString(),
      );
      res.redirect(redirectToUrl.toString());
      return;
      return;
    }
    res.redirect(`http://admin.${this.utilsService.getDomainName()}`);
  }
}
