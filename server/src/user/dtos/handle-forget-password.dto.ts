import { IsEmail, IsNotEmpty } from 'class-validator';

export class HandleForgetPasswordDto {
  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail(undefined, { message: 'Invalid email' })
  email!: string;
}
