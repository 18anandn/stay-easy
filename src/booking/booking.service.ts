import { UtilsService } from 'src/utils/utils.service';
import { Brackets, DataSource, IsNull, LessThan, MoreThan } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { Booking } from './booking.entity';
import { Hotel } from '../hotel/hotel.entity';
import { Cabin } from '../cabin/cabin.entity';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { CurrentUserDto } from '../user/dtos/current-user.dto';

@Injectable()
export class BookingService {
  constructor(
    private dataSource: DataSource,
    private utilService: UtilsService,
  ) {}

  async createBooking(
    { hotelId, from_date: book_from, to_date: book_to }: CreateBookingDto,
    user: CurrentUserDto,
  ) {
    if (book_from > book_to) {
      throw new BadRequestException('Date orders are wrong');
    }
    if (!isUUID(hotelId, 4)) {
      throw new NotFoundException(`No hotel with id: ${hotelId}`);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const hotel = await queryRunner.manager
        .getRepository(Hotel)
        .createQueryBuilder('hotel')
        .select()
        .where('hotel.id = :hotelId', { hotelId })
        .setLock('pessimistic_write')
        .getOne();
      if (!hotel) {
        throw new Error('no hotel');
      }

      const query = queryRunner.manager
        .getRepository(Cabin)
        .createQueryBuilder('cabin')
        .select()
        .where(this.utilService.getNonOverlappingDatesQuery(book_from, book_to));

      const availableCabins = await query.getMany();
      // console.log(availableCabins);
      if (!availableCabins || availableCabins.length === 0) {
        throw new Error('not cabin');
      }

      const booking = queryRunner.manager.getRepository(Booking).create({
        hotel_id: hotelId,
        cabin_id: availableCabins[0].id,
        from_date: book_from,
        to_date: book_to,
        user_id: user.userId,
      });

      const confirmed_booking = await queryRunner.manager
        .getRepository(Booking)
        .save(booking);

      await queryRunner.commitTransaction();
      return confirmed_booking;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      if (error.message === 'no hotel') {
        throw new NotFoundException(
          'No hotel with the given Id',
        );
      } else if (error.message === 'not cabin') {
        throw new NotFoundException(
          'No cabins available in the given date range',
        );
      } else {
        throw new InternalServerErrorException(
          'There was an error booking the cabin.',
        );
      }
    } finally {
      await queryRunner.release();
    }
  }
}
