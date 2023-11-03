import { IsEmail, IsString } from 'class-validator';

export class CurrentUserDto {
  @IsString()
  userId: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  role: string;
}
