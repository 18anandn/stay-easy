import { UtilsService } from 'src/utils/utils.service';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { isUUID } from 'class-validator';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { CurrentUserDto } from '../user/dtos/current-user.dto';
import { differenceInDays, format } from 'date-fns';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadService } from '../upload/upload.service';
import { PageParam } from '../dtos/page-params.dto';
import { DatabaseError } from 'pg-protocol';

const DATE_FORMAT_NUM = 'yyyy-MM-dd';

@Injectable()
export class BookingService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Booking) private bookingRepository: Repository<Booking>,
    private uploadService: UploadService,
  ) {}

  async createBooking(
    { homeId, from_date, to_date, guests }: CreateBookingDto,
    user: CurrentUserDto,
  ) {
    const numDays = differenceInDays(to_date, from_date);
    if (numDays < 1) {
      throw new BadRequestException('Invalid date range');
    }
    if (numDays > 60) {
      throw new BadRequestException('Max 60 days allowed');
    }
    if (!isUUID(homeId, 4)) {
      throw new NotFoundException(`No home with id: ${homeId}`);
    }

    let maxBookings = 20;
    if (user.email.endsWith('@test.com') && user.email !== 'johndoe@test.com') {
      maxBookings = 1000;
    }

    const futureBookings: unknown = await this.bookingRepository
      .createQueryBuilder('booking')
      .select('COALESCE(COUNT(*), 0)', 'count')
      .innerJoin('booking.home', 'home')
      .where(
        'booking.from_date AT TIME ZONE home.time_zone > CURRENT_TIMESTAMP',
      )
      .andWhere('booking.user_id = :userId', { userId: user.id })
      .getRawOne();

    if (
      futureBookings &&
      typeof futureBookings === 'object' &&
      'count' in futureBookings
    ) {
      const count = Number(futureBookings.count);
      if (count >= maxBookings) {
        throw new BadRequestException(
          `Maximum ${maxBookings} future bookings allowed`,
        );
      }
    } else {
      throw new InternalServerErrorException(
        'There was an error while booking',
      );
    }

    const args = {
      home_id: homeId,
      from_date: format(from_date, 'yyyy-MM-dd'),
      to_date: format(to_date, 'yyyy-MM-dd'),
      user_id: user.id,
      guests,
    };

    const args_str = Object.values(args)
      .map((val) => (typeof val === 'number' ? val : `'${val}'`))
      .join(',');
    const query = `SELECT * FROM book_home($1, $2, $3, $4, $5);`;

    try {
      const data = await this.dataSource.query(query, Object.values(args));
      return data[0];
    } catch (error) {
      console.log(error);
      if (
        error instanceof QueryFailedError &&
        error.driverError instanceof DatabaseError
      ) {
        if (error.driverError.code === 'P0001' && error.driverError.message) {
          throw new BadRequestException(error.message);
        }
        throw new BadRequestException('There was an error while booking');
      }
      throw new BadRequestException('There was an error while booking');
    }
  }

  async getAllBookings({ page, sortBy }: PageParam, user: CurrentUserDto) {
    const items_per_page = 5;

    let allTrips = this.bookingRepository
      .createQueryBuilder('booking')
      .where(`booking.user_id = '${user.id}'`)
      .select('booking.id', 'booking_id')
      .addSelect('booking.created_date', 'created_date')
      .addSelect('booking.from_date', 'from_date')
      .addSelect('booking.to_date', 'to_date')
      .leftJoin('booking.home', 'home')
      .addSelect('home.id', 'home_id')
      .addSelect('home.name', 'name')
      .addSelect('home.city', 'city')
      .addSelect('home.state', 'state')
      .addSelect('home.country', 'country')
      .leftJoin('home.main_image', 'main_image')
      .addSelect('main_image.id', 'id')
      .addSelect('main_image.object_key', 'main_image')
      .groupBy('booking.id')
      .addGroupBy('home.id')
      .addGroupBy('main_image.id');

    switch (sortBy) {
      case 'recent': {
        allTrips = allTrips.orderBy('booking.created_date', 'DESC');
        break;
      }
      case 'old': {
        allTrips = allTrips.orderBy('booking.from_date', 'ASC');
        break;
      }
      default: {
        allTrips = allTrips
          .orderBy('booking.from_date > CURRENT_TIMESTAMP', 'DESC')
          .addOrderBy('booking.from_date - CURRENT_TIMESTAMP', 'ASC');
        break;
      }
    }

    let limitedTrips = this.dataSource
      .createQueryBuilder()
      .select()
      .from('trips', 'trips')
      .offset((page - 1) * items_per_page)
      .limit(items_per_page);

    const finalQuery = this.dataSource
      .createQueryBuilder()
      .addCommonTableExpression(allTrips, 'trips')
      .addCommonTableExpression(
        'SELECT COUNT(*) as count FROM trips',
        'count_table',
      )
      .addCommonTableExpression(limitedTrips, 'limitedTrips')
      .select('count_table.count', 'count')
      .from('count_table', 'count_table')
      .leftJoinAndSelect('limitedTrips', 'limitedTrips', 'true');

    const bookingList = await finalQuery.getRawMany();
    // console.log(bookingList);

    const count =
      bookingList && bookingList.length !== 0
        ? parseInt(bookingList[0].count)
        : 0;

    const res = {
      trips:
        count > 0 && bookingList[0].id
          ? bookingList.map((booking) => {
              const {
                booking_id,
                from_date,
                to_date,
                created_date,
                name,
                city,
                state,
                country,
                main_image,
              } = booking;
              // console.log(toIstTime(from_date))
              return {
                id: booking_id,
                from_date: new Date(from_date),
                to_date: new Date(to_date),
                home: {
                  name,
                  city,
                  state,
                  country,
                  main_image: this.uploadService.getPresignedUrl(main_image),
                },
              };
            })
          : [],
      count,
      items_per_page,
    };

    return res;
  }

  async getBooking(bookingId: string, user: CurrentUserDto) {
    const booking = await this.bookingRepository.findOne({
      where: {
        id: bookingId,
        user_id: user.id,
      },
      relations: {
        home: {
          main_image: true,
        },
      },
      select: {
        id: true,
        from_date: true,
        to_date: true,
        paid: true,
        guests: true,
        home: {
          id: true,
          name: true,
          time_zone: true,
          city: true,
          state: true,
          country: true,
          address: true,
          main_image: {
            object_key: true,
          },
          location: {
            coordinates: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`You have no booking with id: ${bookingId}`);
    }

    const { home, ...rest_booking } = booking;
    const { location, main_image, ...rest_home } = home;
    return {
      ...rest_booking,
      home: {
        ...rest_home,
        main_image: this.uploadService.getPresignedUrl(main_image.object_key),
        location: {
          lat: location.coordinates[1],
          lng: location.coordinates[0],
        },
      },
    };
  }
}
