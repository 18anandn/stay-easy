import { z } from 'zod';
import { customFetch } from '../../../utils/customFetch';
import { EmailForResetPassword } from '../types/EmailForResetPassword';

export const getResetPasswordMail = async (data: EmailForResetPassword) => {
  await customFetch('/api/v1/auth/reset-password', z.any(), {
    errorMessage: 'There was an unexpected error',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
};
