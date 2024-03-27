import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Amenity } from './amenity.entity';
import { Repository } from 'typeorm';
import { CreateAmenityDto } from './dtos/create-amenity.dto';
import { CreateManyAmenities } from './dtos/create-many-amenities.dto';

@Injectable()
export class AmenityService {
  constructor(
    @InjectRepository(Amenity) private amenityRepository: Repository<Amenity>,
  ) {}

  createAmenity(createAmenity: CreateAmenityDto) {
    return this.amenityRepository.save(createAmenity);
  }

  createManyAmenity(createAmenity: CreateManyAmenities) {
    return this.amenityRepository.save(createAmenity.amenities);
  }

  getAmenities() {
    return this.amenityRepository.find({
      select: {
        name: true,
      },
    });
  }
}
