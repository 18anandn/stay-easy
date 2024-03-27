import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class BookingFilterDto {
  @IsOptional()
  @IsString()
  filter: string | undefined;

  @IsOptional()
  @IsString()
  sortBy: string | undefined;

  @IsOptional()
  @IsString()
  order: string | undefined;

  @IsOptional()
  // @IsInt()
  // @Min(1)
  page: number | undefined;
}
