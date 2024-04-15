import { IsString, IsNotEmpty, Length } from "class-validator";

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({message: 'Password cannot be empty'})
  @Length(4, 20, { message: 'Password should be 4-20 characters long' })
  password!: string;

  @IsString()
  @IsNotEmpty({message: 'Confirm password cannot be empty'})
  @Length(4, 20, {
    message: 'Confirm password field should be 4-20 characters long',
  })
  confirm_password!: string;
}