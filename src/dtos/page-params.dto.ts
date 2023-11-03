import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class PageParam {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  page: number;
}
