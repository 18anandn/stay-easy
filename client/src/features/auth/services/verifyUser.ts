import { z } from 'zod';
import { customFetch } from '../../../utils/customFetch';

export const verifyUser = (userId: string, token: string) => {
  return customFetch(`/api/v1/auth/verify/${userId}?token=${token}`, z.any(), {
    errorMessage:
      'There was an error while verifying your account. Please try again later',
  });
};
