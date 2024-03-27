import { AuthService } from './auth.service';
import { UtilsService } from '../utils/utils.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { LoginUserDto } from './dtos/login-user.dto';
import { Request, Response } from 'express';

@Controller('api/v1/auth')
@Serialize(UserDto)
export class AuthController {
  constructor(
    private authService: AuthService,
    private utilsService: UtilsService,
  ) {}

  @Get()
  getLoggedInUser(@Req() req: Request) {
    return this.authService.getUserFromCookie(req);
  }

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.authService.signup(createUserDto);
    return user;
  }

  @Post('/login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    // @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.login(loginUserDto);
    await this.utilsService.attachTokenToCookies(res, {
      userId: user.id,
    });
    return user;
  }

  @Get('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.utilsService.removeTokenFromCookes(res);
    return { msg: 'Logged out successfully' };
  }
}
