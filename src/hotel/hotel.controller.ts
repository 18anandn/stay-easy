import { UploadService } from './../upload/upload.service';
import { HotelService } from './hotel.service';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateHotelDto } from './dtos/create-hotel.dto';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUserDto } from '../user/dtos/current-user.dto';
import { FindHotelDto } from './dtos/find-hotel.dto';
import { UpdateHotelDto } from './dtos/update-hotel.dto';
import { PageParam } from '../dtos/page-params.dto';

@Controller('api/v1/hotel')
export class HotelController {
  constructor(
    private hotelService: HotelService,
    private uploadService: UploadService,
  ) {}

  @Post('create')
  @AuthGuard()
  createHotel(
    @Body() hotel: CreateHotelDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.hotelService.createHotel(hotel, user);
  }

  @Get()
  getHotels(@Query() { page }: PageParam) {
    return this.hotelService.getHotels(page);
  }

  @Get('findNearestHotels')
  findHotel(@Query() params: FindHotelDto) {
    return this.hotelService.findHotel(params);
  }

  @Get('/:hotelId')
  getHotel(@Param('hotelId') hotelId: string) {
    return this.hotelService.getHotel(hotelId);
  }

  @Patch('/:hotelId')
  @AuthGuard(['owner'])
  updateHotel(
    @Param('hotelId') hotelId: string,
    @Body() body: UpdateHotelDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.hotelService.updateHotel(hotelId, body, user);
  }

  @Get('/upload/:urls')
  @AuthGuard()
  uploadFile(@Param('urls') urls: number, @CurrentUser() user: CurrentUserDto) {
    return this.uploadService.getPresignedpost(urls, user);
  }
}
