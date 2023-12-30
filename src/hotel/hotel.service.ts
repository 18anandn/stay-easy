import {
  GeocodingService,
  LocationDetails,
} from './../geocoding/geocoding.service';
import { UpdateHotelDto } from './dtos/update-hotel.dto';
import { UtilsService } from 'src/utils/utils.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DataSource, ILike, Point, Repository } from 'typeorm';
import { CreateHotelDto } from './dtos/create-hotel.dto';
import { CurrentUserDto } from '../user/dtos/current-user.dto';
import { Hotel } from './hotel.entity';
import { User, UserRole } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { FindHotelDto } from './dtos/find-hotel.dto';
import { Cabin } from '../cabin/cabin.entity';
import { Amenity } from '../amenity/amenity.entity';
import { UploadService } from '../upload/upload.service';
import { CustomError } from '../errors/CustomError';

@Injectable()
export class HotelService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Hotel) private hotelRepository: Repository<Hotel>,
    private utilService: UtilsService,
    private geocodingService: GeocodingService,
    private uploadService: UploadService,
  ) {}

  async createHotel(
    {
      name,
      location: coords,
      price,
      location_name,
      cabin_amount,
      cabin_capacity,
      amenities,
      images,
    }: CreateHotelDto,
    user: CurrentUserDto,
  ) {
    const [lat, lng] = coords
      .replace(' ', '')
      .split(',')
      .map((val) => parseFloat(val));
    const {
      city,
      state,
      country,
      formatted: complete_address,
    } = await this.geocodingService.getAddress(lat, lng);
    if (!city || !state || !country) {
      throw new BadRequestException('Given location is unregistered');
    }
    if ((country as string).toLowerCase() !== 'india') {
      throw new BadRequestException('Please choose a location in India');
    }

    const location: Point = {
      type: 'Point',
      // IMPORTANT! Longitude comes first in GeoJSON.
      coordinates: [lng, lat],
    };

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const query = {
        name,
        location_name,
        price,
        cabin_amount,
        cabin_capacity,
        location,
        city,
        state,
        country,
        complete_address,
        owner_id: user.userId,
        amenities: amenities
          ? await queryRunner.manager.getRepository(Amenity).find({
              where: amenities.map((name) => {
                return { name: ILike(name) };
              }),
            })
          : [],
      };
      const hotel = await queryRunner.manager.getRepository(Hotel).save(query);

      const cabinRepo = queryRunner.manager.getRepository(Cabin);
      const cabins = cabinRepo.create(
        Array(hotel.cabin_amount).fill({
          hotel_id: hotel.id,
          cabin_capacity: hotel.cabin_capacity,
        }),
      );
      await cabinRepo.save(cabins);
      await queryRunner.manager
        .getRepository(User)
        .update({ id: user.userId }, { role: UserRole.OWNER });
      const files = await this.uploadService.getFiles(images, user);
      hotel.main_image = files[0];
      files.shift();
      hotel.extra_images = files;
      await queryRunner.manager.getRepository(Hotel).save(hotel);
      await queryRunner.commitTransaction();
      return hotel;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      if (error instanceof CustomError) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(
        'There was an error creating the hotel',
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getHotel(hotelId: string) {
    if (!isUUID(hotelId, 4)) {
      throw new NotFoundException(`There was no hotel with id: ${hotelId}`);
    }
    const hotel = await this.hotelRepository.findOne({
      select: {
        id: true,
        name: true,
        price: true,
        price_per_guest: true,
        cabin_capacity: true,
        city: true,
        state: true,
        country: true,
        complete_address: true,
      },
      relations: {
        amenities: true,
        main_image: true,
        extra_images: true,
        cabins: {
          bookings: true,
        },
      },
      where: { id: hotelId },
    });
    if (!hotel) {
      throw new NotFoundException(`There was no hotel with id: ${hotelId}`);
    }
    const bookings = hotel.cabins.map((cabin) =>
      cabin.bookings.map((booking) => [booking.from_date, booking.to_date]),
    );
    const { cabins, ...rest } = hotel;
    return {
      ...rest,
      main_image: this.uploadService.getPresignedUrl(
        hotel.main_image.object_key,
      ),
      extra_images: hotel.extra_images.map((image) =>
        this.uploadService.getPresignedUrl(image.object_key),
      ),
      amenities: hotel.amenities.map((amenity) => amenity.name),
      bookings,
    };
  }

  async findHotel({
    latlng,
    distance,
    book_from,
    book_to,
    amenities,
    address,
    page,
  }: FindHotelDto) {
    if (!book_from || !book_to) {
      book_from = undefined;
      book_to = undefined;
    }
    let querybuiler = this.hotelRepository
      .createQueryBuilder('hotel')
      .select('hotel.id', 'id')
      // .addSelect('cabin.id', 'cabin_id')
      .innerJoin('hotel.cabins', 'cabin');

    let location_details: LocationDetails;

    if (address) {
      location_details = await this.geocodingService.getLocation(address);
      querybuiler = querybuiler.andWhere(
        `ST_Intersects(hotel.location, ST_MakeEnvelope(${[
          location_details.box.lon1,
          location_details.box.lat1,
          location_details.box.lon2,
          location_details.box.lat2,
        ].join(',')}, 4326)::geography('POLYGON'))`,
      );
    } else if (latlng) {
      const origin: Point = {
        type: 'Point',
        coordinates: latlng
          .replace(' ', '')
          .split(',')
          .reverse()
          .map((val) => parseFloat(val)),
      };
      querybuiler = querybuiler
        .addSelect(
          'ST_DistanceSphere(hotel.location::geometry, ST_SetSRID(ST_GeomFromGeoJSON(:origin), 4326))/1000',
          'distance',
        )
        .andWhere(
          'ST_DWithin(hotel.location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), 4326)::geography ,:range, false)',
        );
      querybuiler = querybuiler.setParameters({
        origin: JSON.stringify(origin),
        range: distance && distance > 1000 ? distance : 1000,
      });
    }

    if (book_from) {
      querybuiler = querybuiler.andWhere(
        this.utilService.getNonOverlappingDatesQuery(book_from, book_to),
      );
    }

    if (amenities && amenities.length !== 0) {
      console.log(amenities);
      const names = amenities.replace(' ', '').toLowerCase().split(',');
      querybuiler = querybuiler
        .innerJoin('hotel.amenities', 'amenity')
        .andWhere('LOWER(amenity.name) IN (:...names)', { names })
        .having('COUNT(DISTINCT amenity.name) = :count', {
          count: names.length,
        });
    }

    querybuiler = querybuiler.addGroupBy('hotel.id');

    querybuiler = querybuiler
      .innerJoin('hotel.main_image', 'file')
      .addSelect('file.object_key', 'main_image_url')
      .addGroupBy('main_image_url');

    querybuiler = querybuiler
      .addSelect('hotel.number', 'number')
      .addSelect('hotel.name', 'name')
      .addSelect('hotel.city', 'city')
      .addSelect('hotel.state', 'state');
    // .addGroupBy('number')
    // .addGroupBy('name')
    // .addGroupBy('city')
    // .addGroupBy('state');

    querybuiler = querybuiler.distinctOn(['hotel.number']);

    querybuiler = querybuiler.addSelect('COUNT(*) over()', 'count');

    const items_per_page = 2;
    const current_page = page ?? 1;
    querybuiler = querybuiler
      .orderBy('hotel.number')
      .offset((current_page - 1) * items_per_page)
      .limit(items_per_page);

    const data = await querybuiler.getRawMany();

    return {
      data: data.map((hotel) => {
        const { number, main_image_url, count, ...rest } = hotel;
        return {
          ...rest,
          main_image_url,
          // main_image_url: this.uploadService.getPresignedUrl(main_image_url),
        };
      }),
      count: data.length > 0 ? data[0].count : 0,
    };
  }

  async getHotels(page: number) {
    const items_per_page = 10;
    const current_page = page ?? 1;
    const [hotels, count] = await this.hotelRepository.findAndCount({
      select: {
        id: true,
        number: true,
        name: true,
        price: true,
        cabin_capacity: true,
        city: true,
        state: true,
        country: true,
        complete_address: true,
      },
      relations: {
        main_image: true,
        extra_images: true,
      },
      order: {
        number: 'ASC',
      },
      take: items_per_page,
      skip: (current_page - 1) * items_per_page,
    });
    const arr = hotels.map((hotel) => {
      return {
        id: hotel.id,
        name: hotel.name,
        price: hotel.price,
        cabin_capacity: hotel.cabin_capacity,
        city: hotel.city,
        state: hotel.state,
        main_image: this.uploadService.getPresignedUrl(
          hotel.main_image.object_key,
        ),
      };
    });
    return { hotels: arr, totalPages: Math.ceil(count / items_per_page) };
  }

  async updateHotel(
    hotelId: string,
    { name, location, location_name, amenities }: UpdateHotelDto,
    user: CurrentUserDto,
  ) {
    if (!isUUID(hotelId, 4)) {
      throw new NotFoundException(`No hotel with id: ${hotelId}`);
    }
    let hotel = await this.hotelRepository.findOneBy({ id: hotelId });
    if (!hotel) {
      throw new NotFoundException(`No hotel with id: ${hotelId}`);
    }
    if (hotel.owner_id !== user.userId) {
      throw new UnauthorizedException('Unauthorized action.');
    }
    hotel.name = name ?? hotel.name;
    if (amenities && amenities.length !== 0) {
      hotel.amenities = await this.dataSource.manager
        .getRepository(Amenity)
        .find({
          where: amenities.map((name) => {
            return { name: ILike(name) };
          }),
        });
    }

    if (location) {
      const [lat, lng] = location
        .replace(' ', '')
        .split(',')
        .map((val) => parseFloat(val));
      const {
        city,
        state,
        country,
        formatted: complete_address,
      } = await this.geocodingService.getAddress(lat, lng);
      const new_location: Point = {
        type: 'Point',
        // IMPORTANT! Longitude comes first in GeoJSON.
        coordinates: [lng, lat],
      };
      hotel = {
        ...hotel,
        city,
        state,
        country,
        complete_address,
        location: new_location,
      };
    }

    hotel.location_name = location_name ?? hotel.location_name;

    return this.hotelRepository.save(hotel);
  }
}
