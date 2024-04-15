import { z } from 'zod';
import { customFetch } from '../../../utils/customFetch';
import { PasswordRefined } from '../types/PasswordSchemaRefined';

type ResetPasswordArg = {
  userId: string;
  token: string;
  newPassword: PasswordRefined;
};

export const resetUserPassword = async ({
  userId,
  token,
  newPassword,
}: ResetPasswordArg) => {
  await customFetch(
    `/api/v1/auth/reset-password/${userId}?token=${token}`,
    z.any(),
    {
      errorMessage: 'There was an error while resetting the password',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPassword),
    }
  );
};
