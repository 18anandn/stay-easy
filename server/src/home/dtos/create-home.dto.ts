import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { VerifyCreateHomeDataDto } from './verify-create-home-data';

export class CreateHomeDto extends VerifyCreateHomeDataDto {
  @IsString({ each: true })
  @IsNotEmpty()
  @ArrayNotEmpty()
  @ArrayMinSize(5)
  @ArrayMaxSize(10)
  images!: string[];
}
