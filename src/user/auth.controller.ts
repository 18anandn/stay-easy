import { AuthService } from './auth.service';
import { UtilsService } from '../utils/utils.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { LoginUserDto } from './dtos/login-user.dto';
import { Response } from 'express';

@Controller('api/v1/auth')
@Serialize(UserDto)
export class AuthController {
  constructor(
    private authService: AuthService,
    private utilsService: UtilsService,
  ) {}

  @Post('/signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.signup(createUserDto);
    await this.utilsService.attachTokenToCookies(res, {
      userId: user.id,
    });
    return user;
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.login(loginUserDto);
    await this.utilsService.attachTokenToCookies(res, {
      userId: user.id,
    });
    res.cookie('loggedIn', 'logged-in');
    return user;
  }

  @Get('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('token', null, {
      path: '/',
      expires: new Date(Date.now()),
    });
    res.cookie('loggedIn', null, {
      path: '/',
      expires: new Date(Date.now()),
    });
    return { msg: 'Logged out successfully' };
  }
}
