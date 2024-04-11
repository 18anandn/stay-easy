import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class GoogleUserDetailsDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  first_name!: string;

  @IsString()
  @IsNotEmpty()
  last_name!: string;

  // @IsString()
  // @IsNotEmpty()
  // image!: string;
}
