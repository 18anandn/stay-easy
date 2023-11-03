import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsInt,
  IsLatLong,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateHotelDto {
  @IsString()
  @Length(2, 20, { message: 'Name should be 2-20 characters long' })
  @IsNotEmpty()
  name: string;

  @IsLatLong()
  @IsNotEmpty()
  location: string;

  @IsString()
  @Length(3, 90, { message: 'Address should be 3-90 character long' })
  @IsOptional()
  location_name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsInt()
  @IsNotEmpty()
  cabin_amount: number;

  @IsInt()
  @IsNotEmpty()
  cabin_capacity: number;

  @IsString({ each: true })
  @IsOptional()
  amenities: string[];

  @IsString({ each: true })
  @IsNotEmpty()
  @ArrayNotEmpty()
  @ArrayMinSize(5)
  @ArrayMaxSize(10)
  images: string[];
}
