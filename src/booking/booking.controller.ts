import { BookingService } from './booking.service';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { CurrentUserDto } from '../user/dtos/current-user.dto';
import { PageParam } from '../dtos/page-params.dto';

@Controller('api/v1/booking')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post()
  @AuthGuard()
  creatBooking(
    @Body() body: CreateBookingDto,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.bookingService.createBooking(body, user);
  }

  @Get('/all')
  @AuthGuard()
  getAllBookings(
    @Query() { page }: PageParam,
    @CurrentUser() user: CurrentUserDto,
  ) {
    return this.bookingService.getAllBookings(page, user);
  }
}
