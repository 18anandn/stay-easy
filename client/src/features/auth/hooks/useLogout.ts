import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../services/logout';

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await logout();
      await queryClient.resetQueries();
    },
  });
};
