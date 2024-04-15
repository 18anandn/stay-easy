import { IsNotEmpty, IsUUID } from 'class-validator';

export class UserIdDto {
  @IsNotEmpty({ message: 'User ID cannot be empty' })
  @IsUUID(undefined, { message: 'Invalid user ID' })
  userId!: string;
}
