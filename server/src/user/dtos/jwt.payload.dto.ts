import { Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

export class JwtPayloadDto {
  @Expose()
  @IsUUID()
  id!: string;
}
