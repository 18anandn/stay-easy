import { IsEmail, IsString } from 'class-validator';

export class CurrentUserDto {
  @IsString()
  userId: string;

  @IsEmail()
  email: string;

  @IsString()
  role: string;
}
