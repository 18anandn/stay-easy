import { z } from 'zod';

export const EmailForResetPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email cannot be empty' })
    .email('Invalid email'),
});

export type EmailForResetPassword = z.infer<typeof EmailForResetPasswordSchema>;
