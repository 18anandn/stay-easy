import { z } from 'zod';

const EmailRequired = 'Email is required';
const EmailFormat = 'Enter a valid email';
const PasswordRequired = 'Password should not be empty';

export const CredentialSchema = z.object({
  email: z
    .string({ required_error: EmailRequired })
    .min(1, { message: EmailRequired })
    .email(EmailFormat),
  password: z
    .string({ required_error: PasswordRequired })
    .min(1, { message: PasswordRequired }),
});

export type Credentials = z.infer<typeof CredentialSchema>;
