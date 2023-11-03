import { Module } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { UtilsModule } from '../utils/utils.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './hotel.entity';
import { GeocodingModule } from '../geocoding/geocoding.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel]), UtilsModule, GeocodingModule, UploadModule],
  providers: [HotelService],
  controllers: [HotelController],
})
export class HotelModule {}
