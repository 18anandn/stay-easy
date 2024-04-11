import { IsEmail, IsString } from 'class-validator';
import { UserRole } from '../UserRole.enum';

export class CurrentUserDto implements Express.UserDataInRequest {
  @IsString()
  id!: string;

  @IsEmail()
  email!: string;

  @IsString()
  role!: UserRole;
}
