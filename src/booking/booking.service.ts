import { UtilsService } from 'src/utils/utils.service';
import {
  Brackets,
  DataSource,
  IsNull,
  LessThan,
  MoreThan,
  Repository,
} from 'typeorm';
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
import { ticketGenerator } from '../utility/ticket-generator';
import { differenceInDays, format } from 'date-fns';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadService } from '../upload/upload.service';

const DATE_FORMAT_NUM = 'yyyy-MM-dd';

@Injectable()
export class BookingService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
    private utilService: UtilsService,
    private uploadService: UploadService,
  ) {}

  async createBooking(
    {
      hotelId,
      from_date: book_from,
      to_date: book_to,
      guests,
    }: CreateBookingDto,
    user: CurrentUserDto,
  ) {
    const numDays = differenceInDays(book_to, book_from);
    if (numDays < 1) {
      throw new BadRequestException('Invalid date range');
    }
    if (numDays > 14) {
      throw new BadRequestException('Max 14 days allowed');
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
        .where(this.utilService.getNonOverlappingDatesQuery(book_from, book_to))
        .orderBy('cabin.id');

      const availableCabins = await query.getMany();
      // console.log(availableCabins);
      if (!availableCabins || availableCabins.length === 0) {
        throw new Error('not cabin');
      }

      const bookingRepo = queryRunner.manager.getRepository(Booking);

      const booking = bookingRepo.create({
        hotel_id: hotelId,
        cabin_id: availableCabins[0].id,
        from_date: book_from,
        to_date: book_to,
        user_id: user.userId,
        paid:
          ((hotel.price * 100 +
            (guests > 2 ? (guests - 2) * hotel.price_per_guest * 100 : 0)) *
            numDays * 11) /
          1000,
      });

      const confirmed_booking = await bookingRepo.save(booking);

      confirmed_booking.booking_id = ticketGenerator(confirmed_booking.id);

      await bookingRepo.save(confirmed_booking);

      await queryRunner.commitTransaction();
      return {
        id: confirmed_booking.booking_id,
        from_date: confirmed_booking.from_date,
        to_date: confirmed_booking.to_date,
        // from: format(confirmed_booking.from_date, DATE_FORMAT_NUM),
        // to: format(confirmed_booking.to_date, DATE_FORMAT_NUM),
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      if (error.message === 'no hotel') {
        throw new NotFoundException('No hotel with the given Id');
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

  async getAllBookings(page: number, user: CurrentUserDto) {
    const items_per_page = 1;
    const current_page = page ?? 1;
    const [bookings, count] = await this.bookingRepository.findAndCount({
      where: {
        user_id: user.userId,
      },
      relations: {
        hotel: {
          main_image: true,
        },
      },
      select: {
        id: true,
        booking_id: true,
        createdDate: true,
        from_date: true,
        to_date: true,
        hotel: {
          name: true,
          city: true,
          state: true,
          main_image: {
            object_key: true,
          },
        },
      },
      order: {
        
        createdDate: 'DESC',
      },
      take: items_per_page,
      skip: (current_page - 1) * items_per_page,
    });
    return {
      trips: bookings.map((booking) => {
        const { createdDate, id, booking_id, hotel, ...rest } = booking;
        return {
          id: booking_id,
          ...rest,
          hotel: {
            ...hotel,
            main_image: this.uploadService.getPresignedUrl(
              hotel.main_image.object_key,
            ),
          },
        };
      }),
      count,
      totalPages: Math.ceil(count / items_per_page),
    };
  }
}
