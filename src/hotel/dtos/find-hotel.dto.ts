import {
  IsDate,
  IsLatLong,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class FindHotelDto {
  @IsLatLong()
  @IsNotEmpty()
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
}
