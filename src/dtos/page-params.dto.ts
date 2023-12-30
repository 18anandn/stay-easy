import { IsInt, IsOptional, Min } from 'class-validator';

export class PageParam {
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number;
}
