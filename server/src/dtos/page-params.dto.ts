import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class PageParam {
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number = 1;

  @IsString()
  @IsOptional()
  sortBy: string = 'default';
}
