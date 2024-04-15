import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator"

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 25, { message: 'First name should be 4-25 characters long' })
  first_name!: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 25, { message: 'Last name should be 4-25 characters long' })
  last_name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @Length(4, 20, { message: 'Password should be 4-20 characters long' })
  password!: string;

  @IsString()
  @IsNotEmpty({ message: 'Confirm password cannot be empty' })
  @Length(4, 20, {
    message: 'Confirm password field should be 4-20 characters long',
  })
  confirm_password!: string;
}