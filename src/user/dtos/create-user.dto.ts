import { IsEmail, IsString, Length } from "class-validator"

export class CreateUserDto {
  @IsString()
  @Length(4, 25, { message: 'First name should be 4-25 characters long' })
  first_name: string;

  @IsString()
  @Length(4, 25, { message: 'Last name should be 4-25 characters long' })
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(4, 25, { message: 'Password should be 4-10 characters long' })
  password: string;
}