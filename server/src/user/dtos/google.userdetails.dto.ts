import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

export class GoogleUserDetailsDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50, { message: 'Maximum email length can be 50' })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 30, { message: 'First name should be 2-30 characters long' })
  first_name!: string;

  @IsString()
  @IsOptional()
  @Length(2, 30, { message: 'Last name should be 2-30 characters long' })
  last_name?: string;

  // @IsString()
  // @IsNotEmpty()
  // image!: string;
}
