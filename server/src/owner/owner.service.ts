import { Injectable } from '@nestjs/common';
import { CurrentUserDto } from '../user/dtos/current-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Home } from '../home/home.entity';
import { Repository, DataSource } from 'typeorm';
import { UploadService } from '../upload/upload.service';
import {
  addMonths,
  endOfYear,
  format,
  getDaysInMonth,
  startOfMonth,
  startOfYear,
  subMonths,
} from 'date-fns';
import { DATE_FORMAT_NUM } from '../utility/date-funcs';
import { BookingFilterDto } from './dtos/booking-filter.dto';
import { BookingFilter } from './enums/BookingFilter';
import { BookingSort } from './enums/BookingSort';
import { Booking } from '../booking/booking.entity';

@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(Home) private homeRepository: Repository<Home>,
    private dataSource: DataSource,
    private uploadService: UploadService,
  ) {}

  async getOwnerHomes(owner: CurrentUserDto) {
    const data = await this.homeRepository.find({
      where: { owner: { id: owner.userId } },
      select: {
        id: true,
        name: true,
        city: true,
        country: true,
        main_image: {
          object_key: true,
        },
      },
      relations: { main_image: true },
      order: {
        number_of_cabins: 'DESC',
        created_date: 'DESC',
      },
    });
    return {
      data: data.map((home) => ({
        ...home,
        main_image: this.uploadService.getPresignedUrl(
          home.main_image.object_key,
        ),
      })),
    };
  }

  async getHomeData(id: string, owner: CurrentUserDto) {
    const getImagesQueryBuilder = this.homeRepository
      .createQueryBuilder('home')
      .select('array_agg(extra_images.object_key)', 'images')
      .where('home.id = :homeId1', { homeId1: id })
      .leftJoin('home.extra_images', 'extra_images')
      .groupBy('home.id');

    const getAmenitiesQueryBuilder = this.homeRepository
      .createQueryBuilder('home')
      .select('array_agg(amenities.name)', 'amenities')
      .where('home.id = :homeId2', { homeId2: id })
      .leftJoin('home.amenities', 'amenities')
      .groupBy('home.id');

    const queryBuilder = this.homeRepository
      .createQueryBuilder('home')
      .addCommonTableExpression(getImagesQueryBuilder, 'extra_images_table')
      .addCommonTableExpression(getAmenitiesQueryBuilder, 'amenities_table')
      .select('home.id', 'id')
      .addSelect('home.name', 'name')
      .addSelect('home.location', 'location')
      .addSelect('home.city', 'city')
      .addSelect('home.state', 'state')
      .addSelect('home.country', 'country')
      .addSelect('home.address', 'address')
      .addSelect('COALESCE(SUM(booking.paid), 0)', 'revenue')
      .addSelect('COALESCE(COUNT(booking.id), 0)', 'total_bookings')
      .addSelect('main_image.object_key', 'main_image')
      .addSelect('extra_images_table.images', 'extra_images')
      .addSelect('amenities_table.amenities', 'amenities')
      .where('home.id = :homeId', { homeId: id })
      .andWhere('user.id = :userId', { userId: owner.userId })
      .leftJoin('home.owner', 'user')
      .leftJoin('home.bookings', 'booking')
      .leftJoin('home.main_image', 'main_image')
      .innerJoin('extra_images_table', 'extra_images_table', 'true')
      .innerJoin('amenities_table', 'amenities_table', 'true')
      .groupBy('home.id')
      .addGroupBy('extra_images_table.images')
      .addGroupBy('amenities_table.amenities')
      .addGroupBy('main_image.object_key')
      .cache(`owner-home-data-${owner.userId}-${id}`, 60000);

    const data = await queryBuilder.getRawOne();
    delete data.id;
    const { revenue, main_image, extra_images, location, ...rest } = data;

    return {
      ...rest,
      location: location.coordinates.reverse(),
      total_bookings: parseInt(data.total_bookings),
      revenue: (parseFloat(revenue) * 95) / 100,
      images: [main_image, ...extra_images].map((object_key) =>
        this.uploadService.getPresignedUrl(object_key),
      ),
    };
  }

  async getHomeAnalytics(
    id: string,
    year: number,
    owner: CurrentUserDto,
  ): Promise<AnalyticsData> {
    const date = new Date(year, 0, 1);
    const start_date = format(startOfYear(date), DATE_FORMAT_NUM);
    const end_date = format(endOfYear(date), DATE_FORMAT_NUM);

    const [data]: AnalyticsData[] = await this.homeRepository.query(
      'SELECT * FROM get_month_booking_data($1::uuid, $2::uuid, $3::date, $4::date);',
      [id, owner.userId, start_date, end_date],
    );

    return {
      ...data,
      month_data: data.month_data.map((val) => ({
        ...val,
        revenue: Number(((val.revenue * 95) / 100).toFixed(2)),
        month: new Date(val.month),
      })),
      by_month_stats: {
        ...data.by_month_stats,
        revenue: {
          min: Number(
            ((data.by_month_stats.revenue.min * 95) / 100).toFixed(2),
          ),
          avg: Number(
            ((data.by_month_stats.revenue.avg * 95) / 100).toFixed(2),
          ),
          max: Number(
            ((data.by_month_stats.revenue.max * 95) / 100).toFixed(2),
          ),
        },
      },
      by_booking_stats: {
        ...data.by_booking_stats,
        revenue: {
          min: Number(
            ((data.by_booking_stats.revenue.min * 95) / 100).toFixed(2),
          ),
          avg: Number(
            ((data.by_booking_stats.revenue.avg * 95) / 100).toFixed(2),
          ),
          max: Number(
            ((data.by_booking_stats.revenue.max * 95) / 100).toFixed(2),
          ),
          total: Number(
            ((data.by_booking_stats.revenue.total * 95) / 100).toFixed(2),
          ),
        },
      },
    };
  }

  async getBookingList(
    id: string,
    filters: BookingFilterDto,
    owner: CurrentUserDto,
  ) {
    const homeQueryBuilder = this.dataSource
      .createQueryBuilder()
      .select('home.id', 'id')
      .addSelect('home.name', 'name')
      .addSelect('home.time_zone', 'time_zone')
      .from(Home, 'home')
      .innerJoin('home.owner', 'user')
      .where('home.id = :homeId', { homeId: id })
      .andWhere('user.id = :ownerId', { ownerId: owner.userId });

    let bookingQueryBuilder = this.dataSource
      .createQueryBuilder()
      .select('booking.id', 'id')
      .addSelect('booking.from_date', 'from_date')
      .addSelect('booking.to_date', 'to_date')
      .addSelect("user.first_name || ' ' || user.last_name", 'user')
      .from('home_table', 'home_table')
      .leftJoin(Booking, 'booking', 'booking.home = home_table.id')
      .innerJoin('booking.user', 'user');

    const filter = filters.filter?.toLowerCase();

    switch (filter) {
      case BookingFilter.CHECK_IN_TODAY:
        bookingQueryBuilder = bookingQueryBuilder.andWhere(
          'booking.from_date = (CURRENT_TIMESTAMP AT TIME ZONE home_table.time_zone)::date',
        );
        break;
      case BookingFilter.CHECK_OUT_TODAY:
        bookingQueryBuilder = bookingQueryBuilder.andWhere(
          'booking.to_date = (CURRENT_TIMESTAMP AT TIME ZONE home_table.time_zone)::date',
        );
        break;
      case BookingFilter.PAST:
        bookingQueryBuilder = bookingQueryBuilder.andWhere(
          'booking.from_date < (CURRENT_TIMESTAMP AT TIME ZONE home_table.time_zone)::date',
        );
        break;
      case BookingFilter.UPCOMING:
        bookingQueryBuilder = bookingQueryBuilder.andWhere(
          'booking.from_date > (CURRENT_TIMESTAMP AT TIME ZONE home_table.time_zone)::date',
        );
        break;
      case BookingFilter.ONGOING:
        bookingQueryBuilder = bookingQueryBuilder.andWhere(
          'booking.from_date < (CURRENT_TIMESTAMP AT TIME ZONE home_table.time_zone)::date AND booking.to_date > (CURRENT_TIMESTAMP AT TIME ZONE home_table.time_zone)::date',
        );
        break;
    }

    const sortBy = filters.sortBy?.toLowerCase();
    if (
      filter === BookingFilter.CHECK_IN_TODAY ||
      filter === BookingFilter.CHECK_OUT_TODAY
    ) {
      bookingQueryBuilder = bookingQueryBuilder.orderBy(
        'booking.created_date',
        'DESC',
      );
    } else {
      const order_arg = filters.order?.toUpperCase();
      let order: 'ASC' | 'DESC' =
        order_arg === 'ASC' || order_arg === 'DESC' ? order_arg : 'ASC';
      switch (sortBy) {
        case BookingSort.BOOKING:
          bookingQueryBuilder = bookingQueryBuilder.orderBy(
            'booking.created_date',
            order,
          );
          break;
        default:
          bookingQueryBuilder = bookingQueryBuilder.orderBy(
            'booking.from_date',
            order,
          );
      }
    }

    const countQueryBuilder = this.dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from('booking_table', 'booking_table');

    const items_per_page = 10;
    const page = filters.page ?? 1;
    const limitQueryBuilder = this.dataSource
      .createQueryBuilder()
      .select()
      .from('booking_table', 'booking_table')
      .offset((page - 1) * items_per_page)
      .limit(items_per_page);

    const jsonAggQueryBuilder = this.dataSource
      .createQueryBuilder()
      .select("COALESCE(json_agg(booking_table_limited), '[]')", 'data')
      .from('booking_table_limited', 'booking_table_limited');

    const finalQueryBuilder = this.dataSource
      .createQueryBuilder()
      .addCommonTableExpression(homeQueryBuilder, 'home_table')
      .addCommonTableExpression(bookingQueryBuilder, 'booking_table')
      .addCommonTableExpression(countQueryBuilder, 'count_table')
      .addCommonTableExpression(limitQueryBuilder, 'booking_table_limited')
      .addCommonTableExpression(jsonAggQueryBuilder, 'result_table')
      .select('home_table.id', 'id')
      .addSelect('home_table.name', 'name')
      .addSelect('result_table.data', 'bookingList')
      .addSelect('count_table.count', 'count')
      .from('home_table', 'home_table')
      .innerJoin('result_table', 'result_table', 'true')
      .innerJoin('count_table', 'count_table', 'true');

    const data = await finalQueryBuilder.getRawOne();
    return { ...data, items_per_page };
  }
}

type Stats = {
  min: number;
  avg: number;
  max: number;
};

type StatsWithTotal = {
  min: number;
  avg: number;
  max: number;
  total: number;
};

type AnalyticsData = {
  id: string;
  name: string;
  number_of_cabins: number;
  number_of_bookings: number;
  month_data: {
    month: Date;
    occupancy: number;
    revenue: number;
    guests: number;
  }[];
  by_month_stats: {
    occupancy: Stats;
    revenue: Stats;
    guests: Stats;
  };
  by_booking_stats: {
    occupancy: StatsWithTotal;
    revenue: StatsWithTotal;
    guests: StatsWithTotal;
  };
};
