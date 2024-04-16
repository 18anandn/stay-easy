import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CurrentUserDto } from '../user/dtos/current-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Home } from '../home/home.entity';
import { Repository, DataSource } from 'typeorm';
import { UploadService } from '../upload/upload.service';
import { endOfYear, format, startOfYear } from 'date-fns';
import { DATE_FORMAT_NUM } from '../utility/date-funcs';
import { BookingFilterDto } from './dtos/booking-filter.dto';
import { BookingFilter } from './enums/BookingFilter';
import { BookingSort } from './enums/BookingSort';
import { Booking } from '../booking/booking.entity';
import { VerificationEnum } from '../home/Verification.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(Home) private homeRepository: Repository<Home>,
    private dataSource: DataSource,
    private uploadService: UploadService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getOwnerHomes(owner: CurrentUserDto) {
    const data = await this.homeRepository.find({
      where: { owner: { id: owner.id } },
      select: {
        id: true,
        name: true,
        city: true,
        country: true,
        address: true,
        message: true,
        main_image: {
          object_key: true,
        },
        verification_status: true,
      },
      relations: { main_image: true },
      order: {
        number_of_cabins: 'DESC',
        created_date: 'DESC',
      },
    });

    const homes = data.map((home) => ({
      ...home,
      main_image: this.uploadService.getPresignedUrl(
        home.main_image.object_key,
      ),
    }));

    const approved = homes.filter(
      (val) => val.verification_status === VerificationEnum.Approved,
    );

    const pending = homes.find(
      (val) => val.verification_status === VerificationEnum.Pending,
    );

    const rejected = homes.find(
      (val) => val.verification_status === VerificationEnum.Rejected,
    );

    return { approved, pending, rejected };
  }

  async getVerifiedHomeData(id: string, owner: CurrentUserDto) {
    const key = `owner-verified-home-data-${owner.id}-${id}`;
    let data: any = await this.cacheManager.get(key);
    if (!data) {
      const res: any[] = await this.dataSource.query(
        'SELECT * FROM get_verified_home_data($1::uuid, $2::uuid)',
        [id, owner.id],
      );
      if (!res || res.length === 0) {
        throw new BadRequestException('No homes owned with the given id');
      }
      [data] = res;
      this.cacheManager.set(key, data, 60000);
    }

    delete data.id;
    const { revenue, main_image, extra_images, location, ...rest } = data;
    const [lat, lng] = location.coordinates.reverse();

    return {
      ...rest,
      location: { lat, lng },
      total_bookings: parseInt(data.total_bookings),
      revenue: (parseFloat(revenue) * 95) / 100,
      images: [main_image, ...extra_images].map((object_key) =>
        this.uploadService.getPresignedUrl(object_key),
      ),
    };
  }

  async getAnyHomeData(id: string, owner: CurrentUserDto) {
    const res: any[] = await this.dataSource.query(
      'SELECT * FROM get_any_home_data($1::uuid, $2::uuid)',
      [id, owner.id],
    );

    if (!res || res.length === 0) {
      throw new NotFoundException('No home with the given id');
    }

    const [data] = res;

    delete data.id;
    const { revenue, main_image, extra_images, location, ...rest } = data;
    const [lat, lng] = location.coordinates.reverse();

    return {
      ...rest,
      location: { lat, lng },
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

    const res: any[] = await this.homeRepository.query(
      'SELECT * FROM get_month_booking_data($1::uuid, $2::uuid, $3::date, $4::date);',
      [id, owner.id, start_date, end_date],
    );

    if (!res || res.length === 0) {
      throw new BadRequestException('No homes owned with the given id');
    }

    const [data]: AnalyticsData[] = res;

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
      .andWhere('user.id = :ownerId', { ownerId: owner.id });

    let bookingQueryBuilder = this.dataSource
      .createQueryBuilder()
      .select('booking.id', 'id')
      .addSelect('booking.from_date', 'from_date')
      .addSelect('booking.to_date', 'to_date')
      .addSelect(
        "CASE WHEN last_name IS NULL THEN first_name ELSE CONCAT(first_name, ' ', last_name) END",
        'user',
      )
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
      .select('COALESCE(COUNT(*), 0)', 'count')
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
      .leftJoin('result_table', 'result_table', 'true')
      .leftJoin('count_table', 'count_table', 'true');

    const data = await finalQueryBuilder.getRawOne();

    if (!data) {
      throw new BadRequestException('No homes owned with the given id');
    }
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
