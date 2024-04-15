import { z } from 'zod';
import { zodExtendPasswordSchema } from '../utils/zodExtendPasswordSchema';

const FirstNameLength = 'First name should be 2-25 characters long';
const LastNameLength = 'Last name should be 2-25 characters long';
const EmailRequired = 'Email is required';

export const SignUpInfoSchema = zodExtendPasswordSchema(
  z.object({
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
  })
);

export type SignUpInfo = z.infer<typeof SignUpInfoSchema>;
