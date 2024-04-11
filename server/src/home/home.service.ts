import {
  GeocodingService,
  LocationDetails,
} from '../geocoding/geocoding.service';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  DataSource,
  ILike,
  Point,
  QueryFailedError,
  Repository,
} from 'typeorm';
import { CreateHomeDto } from './dtos/create-home.dto';
import { CurrentUserDto } from '../user/dtos/current-user.dto';
import { Home } from './home.entity';
import { User } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { FindHomeDto } from './dtos/find-home.dto';
import { Cabin } from '../cabin/cabin.entity';
import { Amenity } from '../amenity/amenity.entity';
import { UploadService } from '../upload/upload.service';
import {
  add,
  addDays,
  endOfMonth,
  format,
  isMatch,
  startOfDay,
  subDays,
} from 'date-fns';
import { DATE_FORMAT_NUM } from '../utility/date-funcs';
import { DatabaseError } from 'pg-protocol';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { getTimeZoneDifference } from '../utility/getTimeZoneDifference';
import { S3File } from '../upload/s3file.entity';
import { UserRoleEnum } from '../user/UserRole.enum';
import { VerificationEnum } from './Verification.enum';

@Injectable()
export class HomeService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Home) private homeRepository: Repository<Home>,
    private geocodingService: GeocodingService,
    private uploadService: UploadService,
  ) {}

  async createHome(
    {
      name,
      location: coords,
      price,
      price_per_guest,
      address,
      number_of_cabins,
      cabin_capacity,
      amenities,
      images,
      description,
    }: CreateHomeDto,
    user: CurrentUserDto,
  ) {
    // const [lat, lng] = coords
    //   .replace(' ', '')
    //   .split(',')
    //   .map((val) => parseFloat(val));
    // const {
    //   city,
    //   state,
    //   country,
    //   formatted: complete_address,
    // } = await this.geocodingService.getAddress(lat, lng);
    // if (!city || !state || !country) {
    //   throw new BadRequestException('Given location is unregistered');
    // }
    // if ((country as string).toLowerCase() !== 'india') {
    //   throw new BadRequestException('Please choose a location in India');
    // }

    const location: Point = {
      type: 'Point',
      // IMPORTANT! Longitude comes first in GeoJSON.
      coordinates: coords
        .replace(' ', '')
        .split(',')
        .map((val) => parseFloat(val))
        .reverse(),
    };

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const homeRepo = queryRunner.manager.getRepository(Home);
      const userRepo = queryRunner.manager.getRepository(User);
      const userInfo = await userRepo.findOne({
        where: {
          id: user.id,
        },
        lock: { mode: 'pessimistic_write' },
      });
      if (!userInfo) {
        throw new BadRequestException('User does not exist');
      }
      const prevHomes = await homeRepo.find({
        where: { owner_id: userInfo.id },
        select: {
          main_image: {
            object_key: true,
          },
          extra_images: {
            object_key: true,
          },
        },
        relations: { main_image: true, extra_images: true },
      });
      if (prevHomes && prevHomes.length !== 0) {
        if (prevHomes.length >= 5 && userInfo.email !== 'test@test.com') {
          throw new BadRequestException('You can register max 5 homes');
        }
        const pendingHome = prevHomes.find(
          (val) => val.verification_status === VerificationEnum.Pending,
        );
        if (pendingHome) {
          throw new BadRequestException(
            'You already have already submitted another home for approval',
          );
        }
        const rejectedHome = prevHomes.find(
          (val) => val.verification_status === VerificationEnum.Rejected,
        );
        if (rejectedHome) {
          const { main_image, extra_images } = rejectedHome;
          const imagesToDelete = [main_image, ...extra_images];
          const imageRepo = queryRunner.manager.getRepository(S3File);
          await this.uploadService.deleteImages(
            imagesToDelete.map((image) => image.object_key),
          );
          await homeRepo.remove(rejectedHome);
          await imageRepo.remove(imagesToDelete);
        }
      }

      if (userInfo.role === UserRoleEnum.USER) {
        userInfo.role = UserRoleEnum.OWNER;
        await userRepo.save(userInfo);
      }
      const query = {
        name,
        address,
        price,
        price_per_guest,
        number_of_cabins,
        cabin_capacity,
        location,
        // city,
        // state,
        // country,
        // complete_address,
        owner_id: user.id,
        amenities: amenities
          ? await queryRunner.manager.getRepository(Amenity).find({
              where: amenities.map((name) => {
                return { name: ILike(name) };
              }),
            })
          : [],
        description,
      };
      const home = await homeRepo.save(query);

      const cabinRepo = queryRunner.manager.getRepository(Cabin);
      const cabins: Cabin[] = [];
      for (let i = 1; i <= number_of_cabins; i++) {
        cabins.push(
          cabinRepo.create({
            home_id: home.id,
            number: i,
          }),
        );
      }
      await cabinRepo.save(cabins);
      const files = await this.uploadService.getFiles(images, user);
      home.main_image = files[0];
      files.shift();
      home.extra_images = files;
      await homeRepo.save(home);
      await queryRunner.commitTransaction();
      return home;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'There was an error creating the home.',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getHome(homeId: string) {
    if (!isUUID(homeId, 4)) {
      throw new NotFoundException(`There was no home with id: ${homeId}`);
    }
    const least_checkout = startOfDay(subDays(new Date(), 2));
    const max_checkin = add(least_checkout, { months: 14 });
    const query = this.homeRepository
      .createQueryBuilder('home')
      .leftJoin('home.amenities', 'amenity')
      .leftJoin('home.cabins', 'cabin')
      .leftJoin(
        'cabin.bookings',
        'booking',
        "booking.to_date >= (:date::timestamp AT TIME ZONE home.time_zone AT TIME ZONE 'UTC')",
        { date: format(least_checkout, DATE_FORMAT_NUM) },
      )
      .innerJoin('home.main_image', 'main_image')
      .leftJoin('home.extra_images', 'extra_images')
      .select([
        'home.name',
        'main_image.object_key',
        'extra_images.object_key',
        'home.location',
        'home.description',
        'home.city',
        'home.state',
        'home.country',
        'home.address',
        'home.time_zone',
        'home.cabin_capacity',
        'home.number_of_cabins',
        'home.price',
        'home.price_per_guest',
        'amenity.name',
        'cabin.id',
        'booking.from_date',
        'booking.to_date',
      ])
      .where('home.id = :homeId', { homeId })
      .orderBy('cabin.number')
      .addOrderBy('booking.from_date')
      .addOrderBy('extra_images.id');

    const home = await query.getOne();

    if (!home) {
      throw new NotFoundException(`There was no home with id: ${homeId}`);
    }
    const bookings: [Date, Date][][] = home.cabins.map((cabin) =>
      cabin.bookings.map((booking) => [booking.from_date, booking.to_date]),
    );
    const { cabins, main_image, extra_images, time_zone, ...rest } = home;
    const minDate = addDays(
      startOfDay(
        utcToZonedTime(zonedTimeToUtc(new Date(), 'UTC'), home.time_zone),
      ),
      1,
    );
    const maxDate = startOfDay(
      endOfMonth(add(minDate, { years: 1, months: 1 })),
    );

    const coords = home.location.coordinates.slice();
    return {
      ...rest,
      time_zone: {
        name: time_zone,
        offset: getTimeZoneDifference(time_zone),
      },
      id: homeId,
      images: [main_image, ...extra_images].map((image) =>
        this.uploadService.getPresignedUrl(image.object_key),
      ),
      location: {
        lat: coords[1],
        lng: coords[0],
      },
      amenities: home.amenities.map((amenity) => amenity.name),
      bookings,
      minDate: format(minDate, DATE_FORMAT_NUM),
      maxDate: format(maxDate, DATE_FORMAT_NUM),
    };
  }

  async findHomes(
    {
      min,
      max,
      country,
      distance,
      dates,
      amenities,
      page,
      sortBy,
    }: FindHomeDto,
    address?: string,
  ) {
    const dateRange = dates?.split('_');
    const checkIn =
      dateRange && dateRange[0] && isMatch(dateRange[0], DATE_FORMAT_NUM)
        ? dateRange[0]
        : null;
    const checkOut =
      dateRange && dateRange[1] && isMatch(dateRange[1], DATE_FORMAT_NUM)
        ? dateRange[1]
        : null;
    const items_per_page = 9;

    let location_details: LocationDetails | null = null;
    if (address && address.length > 0) {
      location_details = await this.geocodingService.getLocation(address);
      if (!location_details) {
        throw new NotFoundException('Location not found');
      }
      country = location_details.country;
    }

    let lnglat: string | null = null;
    let bounds: [[number, number], [number, number]] | undefined = undefined;
    if (location_details) {
      bounds = [
        [location_details.box.lon1, location_details.box.lat1],
        [location_details.box.lon2, location_details.box.lat2],
      ];
    }
    if (min && max) {
      const coords1 = min
        .replace(' ', '')
        .split(',')
        .reverse()
        .map((val) => parseFloat(val));
      const coords2 = max
        .replace(' ', '')
        .split(',')
        .reverse()
        .map((val) => parseFloat(val));

      if (!bounds) {
        bounds = [
          [coords1[0], coords1[1]],
          [coords2[0], coords2[1]],
        ];
      }

      lnglat = [
        (coords1[0] + coords2[0]) / 2,
        (coords1[1] + coords2[1]) / 2,
      ].join(',');
    }

    const args = {
      bounds: bounds ? bounds[0].concat(bounds[1]).join(',') : null,
      lnglat: lnglat && distance && distance > 0 ? lnglat : null,
      distance: distance && distance > 0 ? distance : null,
      amenities: amenities ? amenities.replace(', ', ',').toLowerCase() : null,
      from_date: checkIn,
      to_date: checkOut,
      rows: items_per_page,
      page,
      sortBy: sortBy ?? null,
    };

    try {
      const [{ data, count }] = await this.dataSource.query<FindHomesResult[]>(
        `SELECT * from find_homes($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
        Object.values(args),
      );

      const homes = data.map((home) => {
        const { main_image, extra_images, location, ...rest } = home;
        return {
          ...rest,
          location: JSON.parse(location).coordinates.reverse(),
          images: [main_image, ...extra_images].map((val) =>
            this.uploadService.getPresignedUrl(val),
          ),
        };
      });
      const res = {
        homes,
        bounds: bounds?.slice().map((val) => val.slice().reverse()),
        items_per_page,
        count: parseInt(count),
      };
      return res;
    } catch (error) {
      console.log(error);
      if (
        error instanceof QueryFailedError &&
        error.driverError instanceof DatabaseError &&
        error.driverError.code === 'P0001' &&
        error.driverError.message
      ) {
        throw new BadRequestException(error.message);
      }
      throw new BadRequestException('There was an error while looking');
    }
  }

  async getHomeList(page: number) {
    const items_per_page = 10;
    const current_page = page ?? 1;
    const [homes, count] = await this.homeRepository.findAndCount({
      where: { verification_status: VerificationEnum.Approved },
      select: {
        id: true,
        number: true,
        name: true,
        price: true,
        location: {
          coordinates: true,
        },
        cabin_capacity: true,
        city: true,
        state: true,
        country: true,
        address: true,
      },
      relations: {
        main_image: true,
        extra_images: true,
      },
      order: {
        number: 'ASC',
        // extra_images: {
        //   id: 'ASC',
        // },
      },
      take: items_per_page,
      skip: (current_page - 1) * items_per_page,
    });

    const arr = homes.map((home) => {
      return {
        id: home.id,
        name: home.name,
        price: home.price,
        cabin_capacity: home.cabin_capacity,
        city: home.city,
        state: home.state,
        country: home.country,
        location: {
          lat: home.location.coordinates[1],
          lng: home.location.coordinates[0],
        },
        images: [home.main_image, ...home.extra_images].map((image) =>
          this.uploadService.getPresignedUrl(image.object_key),
        ),
      };
    });
    return { homes: arr, count, items_per_page };
  }

  // async updateHome(
  //   homeId: string,
  //   { name, location, location_name, amenities }: UpdateHomeDto,
  //   user: CurrentUserDto,
  // ) {
  //   if (!isUUID(homeId, 4)) {
  //     throw new NotFoundException(`No home with id: ${homeId}`);
  //   }
  //   let home = await this.homeRepository.findOneBy({ id: homeId });
  //   if (!home) {
  //     throw new NotFoundException(`No home with id: ${homeId}`);
  //   }
  //   if (home.owner_id !== user.id) {
  //     throw new UnauthorizedException('Unauthorized action.');
  //   }
  //   home.name = name ?? home.name;
  //   if (amenities && amenities.length !== 0) {
  //     home.amenities = await this.dataSource.manager
  //       .getRepository(Amenity)
  //       .find({
  //         where: amenities.map((name) => {
  //           return { name: ILike(name) };
  //         }),
  //       });
  //   }

  //   if (location) {
  //     const [lat, lng] = location
  //       .replace(' ', '')
  //       .split(',')
  //       .map((val) => parseFloat(val));
  //     const {
  //       city,
  //       state,
  //       country,
  //       formatted: complete_address,
  //     } = await this.geocodingService.getAddress(lat, lng);
  //     const new_location: Point = {
  //       type: 'Point',
  //       // IMPORTANT! Longitude comes first in GeoJSON.
  //       coordinates: [lng, lat],
  //     };
  //     home = {
  //       ...home,
  //       city,
  //       state,
  //       country,
  //       address,
  //       location: new_location,
  //     };
  //   }

  //   home.address = address ?? home.address;

  //   return this.homeRepository.save(home);
  // }
}

type FindHomesResult = {
  data: {
    id: string;
    name: string;
    location: string;
    city: string;
    state: string;
    country: string;
    distance: number | null;
    price: number;
    main_image: string;
    extra_images: string[];
  }[];
  count: string;
};
