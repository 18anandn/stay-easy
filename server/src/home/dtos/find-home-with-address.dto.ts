import { IsNotEmpty, IsString } from 'class-validator';
import { FindHomeDto } from './find-home.dto';

export class FindHomeWithAddressDto extends FindHomeDto {
  @IsString()
  @IsNotEmpty()
  address!: string;
}
