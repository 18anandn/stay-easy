import { IsEmail, IsString } from 'class-validator';
import { UserRole } from '../user.entity';

export class CurrentUserDto {
  @IsString()
  userId!: string;

  @IsEmail()
  email!: string;

  @IsString()
  role!: UserRole;
}
