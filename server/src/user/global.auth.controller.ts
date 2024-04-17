import { AuthService } from './auth.service';
import { UtilsService } from '../utils/utils.service';
import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  GoogleAuthGuard,
  GoogleOptionalAuthGuard,
} from './guards/google.authguard';

@Controller('/auth')
export class GlobalAuthController {
  constructor(
    private authService: AuthService,
    private utilsService: UtilsService,
  ) {}

  @Get()
  async redirectToAuthPage(
    @Req() req: Request,
    @Res() res: Response,
    @Query('redirectTo') redirectTo: string | undefined,
  ) {
    let redirectUrl = new URL(this.utilsService.authURL + '/login');
    const user = await this.authService.getUserFromCookie(req, res);
    if (!user) {
      if (redirectTo) {
        redirectUrl.searchParams.set('redirectTo', redirectTo);
      }
      res
        .status(HttpStatus.TEMPORARY_REDIRECT)
        .redirect(redirectUrl.toString());
      return;
    }
    if (redirectTo && URL.canParse(redirectTo)) {
      redirectUrl = new URL(redirectTo);
      if (!redirectUrl.hostname.endsWith(this.utilsService.domain_name)) {
        redirectUrl = new URL(this.utilsService.mainURL);
      }
    } else {
      redirectUrl = new URL(this.utilsService.mainURL);
    }
    res.status(HttpStatus.PERMANENT_REDIRECT).redirect(redirectUrl.toString());
  }

  @Get('/google')
  @GoogleAuthGuard()
  handleGoogleAuth() {}

  @Get('/google/redirect')
  @GoogleOptionalAuthGuard()
  async handleGoogleRedirect(
    @Req() req: unknown,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (typeof req === 'object' && req && 'user' in req && req.user) {
      if (
        typeof req.user === 'object' &&
        'id' in req.user &&
        typeof req.user.id === 'string'
      ) {
        await this.utilsService.attachTokenToCookies(res, {
          id: req.user.id,
        });
        res.redirect('/login/success');
        return;
      } else {
        if (req.user instanceof HttpException) {
          const searchParam = new URLSearchParams();
          searchParam.set('error', req.user.message);
          res.redirect(`/login/failure?${searchParam.toString()}`);
          return;
        }
      }
    }
    res.redirect('/login/failure');
  }
}
