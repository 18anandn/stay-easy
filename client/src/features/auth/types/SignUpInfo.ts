import { z } from 'zod';
import { zodExtendPasswordSchema } from '../utils/zodExtendPasswordSchema';

const FirstNameLength = 'First name should be 2-30 characters long';
const LastNameLength = 'Last name should be 2-30 characters long';
const EmailRequired = 'Email is required';

export const SignUpInfoSchema = zodExtendPasswordSchema(
  z.object({
    first_name: z
      .string({ required_error: 'First name is required' })
      .min(2, FirstNameLength)
      .max(30, FirstNameLength),
    last_name: z
      .string()
      .max(30, LastNameLength)
      .optional(),
    email: z
      .string({ required_error: EmailRequired })
      .min(1, EmailRequired)
      .max(50, 'Email should be of maximum 50 characters')
      .email('Invalid email'),
  })
);

export type SignUpInfo = z.infer<typeof SignUpInfoSchema>;
