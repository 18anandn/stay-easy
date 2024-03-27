import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserService } from './user.service';
import { CurrentUserDto } from './dtos/current-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('api/v1/user')
@Serialize(UserDto)
export class UserController {
  constructor(private userService: UserService) {}

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
