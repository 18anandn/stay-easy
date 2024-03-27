import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class YearDto {
  @IsNotEmpty()
  @IsInt()
  @Min(2023)
  year!: number;
}
