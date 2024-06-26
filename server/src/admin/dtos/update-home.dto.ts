import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPostalCode,
  IsString,
  IsTimeZone,
  MinLength,
  NotEquals,
} from 'class-validator';
import { Verification, VerificationEnum } from '../../home/Verification.enum';

export class UpdateHomeDto {
  @IsOptional()
  @IsTimeZone()
  time_zone?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  city?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  state?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  country?: string;

  @IsOptional()
  @IsPostalCode('any')
  postcode?: string;

  @IsEnum(VerificationEnum)
  @IsNotEmpty()
  @NotEquals(VerificationEnum.Pending)
  verification_status!: Verification;

  @IsOptional()
  @IsString()
  @MinLength(1)
  message?: string;
}
