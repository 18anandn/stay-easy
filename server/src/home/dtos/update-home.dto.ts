import {
  IsLatLong,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateHomeDto {

  @IsString()
  @Length(2, 20, { message: 'Name should be 2-20 characters long' })
  @IsOptional()
  name!: string;

  @IsLatLong()
  @IsOptional()
  location!: string;

  @IsString()
  @Length(3, 90, { message: 'Address should be 3-90 character long' })
  @IsOptional()
  location_name!: string;

  @IsString({ each: true })
  @IsOptional()
  amenities!: string[];
}
