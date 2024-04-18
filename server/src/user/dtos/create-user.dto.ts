import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 30, { message: 'First name should be 2-30 characters long' })
  first_name!: string;

  @IsOptional()
  @IsString()
  @Length(2, 30, { message: 'Last name should be 2-30 characters long' })
  last_name?: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50, { message: 'Maximum email length can be 50' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @Length(4, 20, { message: 'Password should be 4-20 characters long' })
  @Matches(/^[a-zA-Z0-9!@#$%^&*()_+{}[\]:;<>,.?/~\-=|\\]+$/, {
    message: 'Invalid characters used in password',
  })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'Confirm password cannot be empty' })
  @Length(4, 20, {
    message: 'Confirm password field should be 4-20 characters long',
  })
  confirm_password!: string;
}
