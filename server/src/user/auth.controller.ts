import { AuthService } from './auth.service';
import { UtilsService } from '../utils/utils.service';
import { CreateUserDto } from './dtos/create-user.dto';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
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
import { UserIdDto } from './dtos/user-id.dto';
import { VerificationTokenDto } from './dtos/verification-token.dto';
import { HandleForgetPasswordDto } from './dtos/handle-forget-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

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
    const user = await this.authService.getUserFromCookie(req, res);
    if (user) return user;
    res.status(HttpStatus.NO_CONTENT);
  }

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.signup(createUserDto);
    return user;
  }

  @Get('verify/:userId')
  verifyUser(
    @Param() { userId }: UserIdDto,
    @Query() { token }: VerificationTokenDto,
  ) {
    return this.authService.verifyUserToken(userId, token);
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

  @Post('/reset-password')
  handleForgetPassword(@Body() { email }: HandleForgetPasswordDto) {
    return this.authService.handleForgetPassword(email);
  }

  @Post('/reset-password/:userId')
  handleResetUserPassword(
    @Param() { userId }: UserIdDto,
    @Query() { token }: VerificationTokenDto,
    @Body() newPassword: ResetPasswordDto,
  ) {
    return this.authService.handleResetUserPassword(userId, token, newPassword);
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

  @Get('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.utilsService.removeTokenFromCookes(res);
    return { msg: 'Logged out successfully' };
  }
}
