import { IsNotEmpty, IsString } from 'class-validator';

export class VerificationTokenDto {
  @IsNotEmpty({ message: 'Token cannot be empty' })
  @IsString({ message: 'Invalid verification token' })
  token!: string;
}
