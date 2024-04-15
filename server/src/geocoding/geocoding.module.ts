import { Module } from '@nestjs/common';
import { GeocodingService } from './geocoding.service';
import { GeocodingController } from './geocoding.controller';
import { GeocodingApiKey } from './geocoding-api-key.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([GeocodingApiKey])],
  providers: [GeocodingService],
  // controllers: [GeocodingController],
  exports: [GeocodingService],
})
export class GeocodingModule {}
