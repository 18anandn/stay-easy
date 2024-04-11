import { z } from 'zod';

const FirstNameLength = 'First name should be 2-25 characters long';
const LastNameLength = 'Last name should be 2-25 characters long';
const EmailRequired = 'Email is required';
const PasswordLength = 'Password should be 4-20 characters long';
const ConfirmPassWordMatch = 'Passwords do not match';

export const SignUpInfoSchema = z
  .object({
    first_name: z
      .string({ required_error: 'First name is required' })
      .min(2, FirstNameLength)
      .max(25, FirstNameLength),
    last_name: z
      .string({ required_error: 'Last name is required' })
      .min(2, LastNameLength)
      .max(25, LastNameLength),
    email: z
      .string({ required_error: EmailRequired })
      .min(1, EmailRequired)
      .email('Invalid email'),
    password: z
      .string({ required_error: 'Password cannot be empty' })
      .min(4, PasswordLength)
      .max(20, PasswordLength),
    confirm_password: z.string({ required_error: ConfirmPassWordMatch }),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: ConfirmPassWordMatch,
    path: ['confirm_password'],
  });

export type SignUpInfo = z.infer<typeof SignUpInfoSchema>;
