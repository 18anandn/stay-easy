import { UploadService } from '../upload/upload.service';
import { HomeService } from './home.service';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateHomeDto } from './dtos/create-home.dto';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUserDto } from '../user/dtos/current-user.dto';
import { FindHomeDto } from './dtos/find-home.dto';
import { PageParam } from '../dtos/page-params.dto';
import { FindHomeWithAddressDto } from './dtos/find-home-with-address.dto';
import { VerifyCreateHomeDataDto } from './dtos/verify-create-home-data';
import { NumberOfImagesDto } from './dtos/number-of-images.dto';

@Controller('api/v1/home')
export class HomeController {
  constructor(
    private homeService: HomeService,
    private uploadService: UploadService,
  ) {}

  @Post('create')
  @AuthGuard()
  createHome(@Body() home: CreateHomeDto, @CurrentUser() user: CurrentUserDto) {
    return this.homeService.createHome(home, user);
  }

  @Post('create/verify/:urls')
  @AuthGuard()
  async verifyCreateHomeData(
    @Param() { urls }: NumberOfImagesDto,
    @Body() data: VerifyCreateHomeDataDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    await this.homeService.verifyCreateHomeData(user);
    return this.uploadService.getPresignedpost(urls, user);
  }

  @Get()
  getHomesList(@Query() { page }: PageParam) {
    return this.homeService.getHomeList(page);
  }

  @Get('/findNearestHomes')
  findHomes(@Query() params: FindHomeDto) {
    return this.homeService.findHomes(params);
  }

  @Get('/findNearestHomesWithAddress')
  findHomesWithAddress(@Query() params: FindHomeWithAddressDto) {
    const { address, ...rest } = params;
    return this.homeService.findHomes(rest, address);
  }

  @Get('/:homeId')
  getHome(@Param('homeId') homeId: string) {
    return this.homeService.getHome(homeId);
  }
}
