import { IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { AmenityType } from '../amenity.entity';
import { CreateAmenityDto } from './create-amenity.dto';

export class CreateManyAmenities {
  @ValidateNested({ each: true })
  @IsNotEmpty()
  amenities!: CreateAmenityDto[];
}
