import { z } from 'zod';

const PasswordLength = 'Password should be 4-20 characters long';
const ConfirmPassWordMatch = 'Passwords do not match';

export const PasswordSchema = z
  .object({
    password: z
      .string({ required_error: 'Password cannot be empty' })
      .min(4, PasswordLength)
      .max(20, PasswordLength),
    confirm_password: z.string({ required_error: ConfirmPassWordMatch }),
  })
