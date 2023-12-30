import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { UtilsModule } from '../utils/utils.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), UtilsModule, UploadModule],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
