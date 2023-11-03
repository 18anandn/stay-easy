import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logoutUser } from '../../apis/user';
import toast from 'react-hot-toast';
import { ServerError } from '../../commonDataTypes';

const useLogout = () => {
  const queryClient = useQueryClient()
  const {
    isLoading: isLoggingOut,
    mutate: logout
  } = useMutation<void, ServerError, void>({
    mutationFn: logoutUser,
    onSuccess: () => {
      toast.success('Logged out successfully');
      queryClient.setQueryData(['current-user'], null);
      // queryClient.invalidateQueries(['current-user'])
    },
    onError: (error) => {
      console.log(error);
      toast.error('There was an error logging out');
    },
  });

  return { isLoggingOut, logout };
};

export { useLogout };
