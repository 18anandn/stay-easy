import { useQuery } from '@tanstack/react-query';
import { verifyUser } from '../services/verifyUser';
import { Exception } from '../../../data/Exception';

export const useVerifyUser = (
  userId: string | null | undefined,
  token: string | null | undefined,
  options: { enabled: boolean }
) => {
  return useQuery({
    ...options,
    queryKey: ['verify-user', userId, token],
    queryFn: () => {
      if (!userId || !token) {
        throw new Exception('Invalid verification attempt', 400);
      }
      return verifyUser(userId, token);
    },
  });
};
