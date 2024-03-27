import { IsEmail, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(4, 25, { message: 'Name should be 4-25 characters long' })
  name!: string;

  @IsEmail()
  email!: string;
}
