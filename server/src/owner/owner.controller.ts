import { UUIDDto } from '../dtos/uuid.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { CurrentUserDto } from '../user/dtos/current-user.dto';
import { BookingFilterDto } from './dtos/booking-filter.dto';
import { YearDto } from './dtos/year.dto';
import { OwnerService } from './owner.service';
import { Controller, Get, Param, Query } from '@nestjs/common';

@Controller('api/v1/owner')
@AuthGuard(['owner', 'admin'])
export class OwnerController {
  constructor(private ownerService: OwnerService) {}

  @Get()
  getOwnerHomes(@CurrentUser() owner: CurrentUserDto) {
    return this.ownerService.getOwnerHomes(owner);
  }

  @Get('/:id')
  getVerifiedHomeData(
    @Param() { id }: UUIDDto,
    @CurrentUser() owner: CurrentUserDto,
  ) {
    return this.ownerService.getVerifiedHomeData(id, owner);
  }

  @Get('/details/:id')
  getAnyHomeData(
    @Param() { id }: UUIDDto,
    @CurrentUser() owner: CurrentUserDto,
  ) {
    return this.ownerService.getAnyHomeData(id, owner);
  }

  @Get('/:id/analytics')
  getHomeAnalytics(
    @Param() { id }: UUIDDto,
    @Query() { year }: YearDto,
    @CurrentUser() owner: CurrentUserDto,
  ) {
    return this.ownerService.getHomeAnalytics(id, year, owner);
  }

  @Get('/:id/booking')
  getBookingList(
    @Param() { id }: UUIDDto,
    @Query() filters: BookingFilterDto,
    @CurrentUser() owner: CurrentUserDto,
  ) {
    return this.ownerService.getBookingList(id, filters, owner);
  }
}
