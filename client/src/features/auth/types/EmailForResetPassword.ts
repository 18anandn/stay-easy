import { z } from 'zod';

export const EmailForResetPasswordSchema = z.object({
  email: z
    .string({ required_error: 'Email cannot be empty' })
    .email('Invalid email')
    .refine((val) => val !== 'johndoe@test.com', {
      message: 'Cannot modify test account',
    }),
});

export type EmailForResetPassword = z.infer<typeof EmailForResetPasswordSchema>;
