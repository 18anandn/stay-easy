import { z } from 'zod';
import { PasswordSchema } from '../types/PasswordSchema';
const ConfirmPassWordMatch = 'Passwords do not match';

export const zodExtendPasswordSchema = <T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
) => {
  return schema
    .merge(PasswordSchema)
    .refine(
      (data) =>
        data.password &&
        /^[a-zA-Z0-9!@#$%^&*()_+{}[\]:;<>,.?/~\-=|\\]+$/.test(data.password),
      { message: 'Invalid characters used for password', path: ['password'] }
    )
    .refine((data) => data.password === data.confirm_password, {
      message: ConfirmPassWordMatch,
      path: ['confirm_password'],
    });
};
