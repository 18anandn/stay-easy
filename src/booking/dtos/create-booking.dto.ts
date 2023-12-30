import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @IsDate()
  @IsNotEmpty()
  from_date: Date;

  @IsDate()
  @IsNotEmpty()
  to_date: Date;

  @IsInt()
  @IsNotEmpty()
  guests: number;
}
