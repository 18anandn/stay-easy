import {
  IsInt,
  IsLatLong,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class VerifyCreateHomeDataDto {
  @IsString()
  @Length(2, 50, { message: 'Name should be 2-50 characters long' })
  @IsNotEmpty()
  name!: string;

  @IsLatLong({ message: 'Invalid coordinates' })
  @IsNotEmpty()
  location!: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 90, { message: 'Address should be 3-90 character long' })
  address!: string;

  @IsNumber()
  @IsNotEmpty()
  price!: number;

  @IsNumber()
  @IsNotEmpty()
  price_per_guest!: number;

  @IsInt()
  @IsNotEmpty()
  number_of_cabins!: number;

  @IsInt()
  @IsNotEmpty()
  cabin_capacity!: number;

  @IsString({ each: true })
  @IsOptional()
  amenities?: string[];

  @IsString()
  @IsNotEmpty()
  @Length(10, 1500, {
    message: 'Description should be 10-1500 characters long',
  })
  description!: string;
}
