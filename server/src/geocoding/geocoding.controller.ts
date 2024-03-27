import { SearchParamsDto } from './dtos/search-params.dto';
import { GeocodingService } from './geocoding.service';
import { Controller, Get, Query } from '@nestjs/common';

@Controller('api/v1/geocoding')
export class GeocodingController {
  constructor(private geocodingService: GeocodingService) {}

  @Get('search')
  getLocation(@Query() { address }: SearchParamsDto) {
    return this.geocodingService.getLocation(address);
  }

  @Get('add-keys')
  addKeys() {
    return this.geocodingService.addKeys();
  }
}
