import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Verification, VerificationEnum } from '../../home/Verification.enum';

export class GetHomeListDto {
  @IsOptional()
  @IsEnum(VerificationEnum)
  verification_status?: Verification;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;
}
