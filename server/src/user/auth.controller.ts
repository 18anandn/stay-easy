import { AuthService } from './auth.service';
import { UtilsService } from '../utils/utils.service';
import { CreateUserDto } from './dtos/create-user.dto';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from './guards/local.authguard';
import { assertHasUser } from './assertHasUser';
import {
  GoogleAuthGuard,
  GoogleOptionalAuthGuard,
} from './guards/google.authguard';
import { isLatLong, isNumber } from 'class-validator';

@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private utilsService: UtilsService,
  ) {}

  @Get()
  async getLoggedInUser(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.getUserFromCookie(req);
    if (user) return user;
    res.sendStatus(HttpStatus.NO_CONTENT);
  }

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.signup(createUserDto);
    return user;
  }

  @Post('/login')
  @LocalAuthGuard()
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    assertHasUser(req);
    const user = req.user.data;
    await this.utilsService.attachTokenToCookies(res, {
      id: user.id,
    });
    return user;
  }

  @Get('/google')
  @GoogleAuthGuard()
  handleGoogleAuth() {}

  @Get('/google/redirect')
  @GoogleOptionalAuthGuard()
  async handleGoogleRedirect(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (
      typeof req === 'object' &&
      req &&
      'user' in req &&
      req.user &&
      'id' in req.user &&
      req.user.id
    ) {
      await this.utilsService.attachTokenToCookies(res, {
        id: req.user.id,
      });
      res.redirect('/login/success');
      return;
    }
    res.redirect('/login/failure');
  }

  @Get('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.utilsService.removeTokenFromCookes(res);
    return { msg: 'Logged out successfully' };
  }
}
