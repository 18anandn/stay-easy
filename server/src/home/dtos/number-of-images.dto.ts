import { IsInt, IsNotEmpty } from 'class-validator';

export class NumberOfImagesDto {
  @IsNotEmpty({ message: 'Number of urls requested must be not be empty' })
  @IsInt({ message: 'Number of urls requested should be an integer' })
  urls!: number;
}
