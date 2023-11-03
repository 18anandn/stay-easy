import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './booking.entity';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking]), UtilsModule],
  providers: [BookingService],
  controllers: [BookingController],
})
export class BookingModule {}
