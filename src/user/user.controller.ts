import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { Body, Controller, Get, Param, Patch, Res } from '@nestjs/common';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserService } from './user.service';
import { CurrentUserDto } from './dtos/current-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Response } from 'express';

@Controller('api/v1/user')
@Serialize(UserDto)
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @AuthGuard()
  getLoggedInUser(
    @CurrentUser() user: CurrentUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.cookie('loggedIn', 'logged-in');
    return user;
  }

  @Get('/profile')
  @AuthGuard()
  getCurrentUserInfo(@CurrentUser() user: CurrentUserDto) {
    return this.userService.findById(user.userId);
  }

  @Get('/:userId')
  showUserInfo(@Param('userId') userId: string) {
    return this.userService.findById(userId);
  }

  @Patch('/profile')
  updateCurrentuser(
    @Body() body: UpdateUserDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.userService.updateUser(body, user.userId);
  }
}
