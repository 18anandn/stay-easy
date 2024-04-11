import { IsNotEmpty, IsUUID } from 'class-validator';

export class UUIDDto {
  @IsNotEmpty()
  @IsUUID('4', { message: 'Invalid id reuested' })
  id!: string;
}
