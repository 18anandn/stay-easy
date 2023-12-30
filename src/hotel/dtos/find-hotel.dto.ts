import {
  IsDate,
  IsInt,
  IsLatLong,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class FindHotelDto {
  @IsLatLong()
  @IsOptional()
  latlng: string;

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Please provide max distance in number' },
  )
  @IsOptional()
  distance: number;

  @IsDate()
  @IsOptional()
  book_from: Date;

  @IsDate()
  @IsOptional()
  book_to: Date;

  @IsString({ each: true })
  @IsOptional()
  amenities: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  page: number;
}
