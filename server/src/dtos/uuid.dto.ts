import { IsNotEmpty, IsUUID } from 'class-validator';

export class UUIDDto {
  @IsNotEmpty()
  @IsUUID('4')
  id!: string;
}
