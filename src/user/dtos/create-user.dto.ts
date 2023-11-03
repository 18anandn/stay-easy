import { IsEmail, IsString, Length } from "class-validator"

export class CreateUserDto {
  @IsString()
  @Length(4, 25, { message: 'Name should be 4-25 characters long' })
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Length(4, 10, { message: 'Password should be 4-10 characters long' })
  password: string;
}