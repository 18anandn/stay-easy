import {
  IsDate,
  IsInt,
  IsLatLong,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class FindHomeDto {
  @IsLatLong()
  @IsOptional()
  min?: string;

  @IsLatLong()
  @IsOptional()
  max?: string;

  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Please provide max distance in number' },
  )
  @IsOptional()
  distance?: number;

  // @IsDate()
  // @IsOptional()
  // checkIn?: Date;

  // @IsDate()
  // @IsOptional()
  // checkOut?: Date;

  @IsString()
  @IsOptional()
  dates?: string;

  @IsString({ each: true })
  @IsOptional()
  amenities?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;

  @IsString()
  @IsOptional()
  sortBy?: string;

  @IsString()
  @IsOptional()
  order?: string;
}
