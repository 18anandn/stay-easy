import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Verification } from '../../home/verification.enum';

export class GetHomeListDto {
  @IsOptional()
  @IsEnum(Verification)
  verification_status?: Verification;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;
}
