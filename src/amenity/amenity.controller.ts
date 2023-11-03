import { AmenityService } from './amenity.service';
import { CreateAmenityDto } from './dtos/create-amenity.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CreateManyAmenities } from './dtos/create-many-amenities.dto';

@Controller('api/v1/amenity')
export class AmenityController {
  constructor(private amenityService: AmenityService) {}

  @Post('create')
  @AuthGuard()
  createAmenity(@Body() body: CreateAmenityDto) {
    return this.amenityService.createAmenity(body);
  }

  @Post('createMany')
  @AuthGuard()
  createManyAmenity(@Body() body: CreateManyAmenities) {
    return this.amenityService.createManyAmenity(body);
  }

  @Get()
  getAmenities() {
    return this.amenityService.getAmenities();
  }
}
