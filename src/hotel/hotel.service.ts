import { GeocodingService } from './../geocoding/geocoding.service';
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
import { HotelInfoDto } from './dtos/hotel-info.dto';

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
      relations: {
        amenities: true,
      },
      where: { id: hotelId },
    });
    if (!hotel) {
      throw new NotFoundException(`There was no hotel with id: ${hotelId}`);
    }
    return hotel;
  }

  findHotel({ latlng, distance, book_from, book_to, amenities }: FindHotelDto) {
    if (!book_from || !book_to) {
      book_from = undefined;
      book_to = undefined;
    }
    const origin: Point = {
      type: 'Point',
      coordinates: latlng
        .replace(' ', '')
        .split(',')
        .reverse()
        .map((val) => parseFloat(val)),
    };
    let querybuiler = this.hotelRepository
      .createQueryBuilder('hotel')
      .select('hotel.id', 'id')
      // .addSelect('cabin.id', 'cabin_id')
      .addSelect(
        'ST_DistanceSphere(hotel.location::geometry, ST_SetSRID(ST_GeomFromGeoJSON(:origin), 4326))/1000',
        'distance',
      )
      .andWhere(
        'ST_DWithin(hotel.location, ST_SetSRID(ST_GeomFromGeoJSON(:origin), 4326)::geography ,:range, false)',
      )
      .innerJoin('hotel.cabins', 'cabin');

    if (book_from) {
      querybuiler = querybuiler.andWhere(
        this.utilService.getNonOverlappingDatesQuery(book_from, book_to),
      );
    }

    if (amenities && amenities.length !== 0) {
      const names = amenities.replace(' ', '').toLowerCase().split(',');
      querybuiler = querybuiler
        .innerJoin('hotel.amenities', 'amenity')
        // .addSelect('amenity.id', 'amenity_id')
        // .addSelect('COUNT(*)', 'count')
        // .addSelect('amenity.name', 'amenity_name')
        .andWhere('LOWER(amenity.name) IN (:...names)', { names })
        .having('COUNT(*) = :count', { count: names.length });
    }

    querybuiler = querybuiler.groupBy('hotel.id').addGroupBy('cabin.id');

    querybuiler = querybuiler
      .addSelect('file.object_key', 'main_image_url')
      .innerJoin('hotel.main_image', 'file')
      .addGroupBy('main_image_url');

    querybuiler = querybuiler
      .addSelect('hotel.city', 'city')
      .addSelect('hotel.state', 'state')
      .addGroupBy('city')
      .addGroupBy('state');

    querybuiler = querybuiler.distinctOn(['hotel.id']);

    querybuiler = querybuiler.setParameters({
      origin: JSON.stringify(origin),
      range: distance,
    });

    return querybuiler.getRawMany();
  }

  async getHotels(page: number) {
    const hotels = await this.hotelRepository.find({
      select: {
        id: true,
        name: true,
        price: true,
        cabin_capacity: true,
        city: true,
        state: true,
        country: true,
        complete_address: true,
        amenities: true,
      },
      relations: {
        main_image: true,
        extra_images: true,
      },
      take: 10,
      skip: (page - 1) * 10,
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
    return arr;
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
