import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { logout as logoutApi } from '../services/logout';

const useLogout = () => {
  const queryClient = useQueryClient();
  const { isPending: isLoggingOut, mutate: logout } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      queryClient.clear();
      toast.success('Logged out successfully');
    },
    onError: () => {
      toast.error('There was an error while logging out');
    },
  });

  return { isLoggingOut, logout };
};

export { useLogout };
