import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { login as loginApi } from '../services/login';
import { Exception } from '../../../data/Exception';

export const useLoginUser = () => {
  const queryClient = useQueryClient();
  const {
    mutate: login,
    isPending: isLoggingIn,
    data: userData,
  } = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      toast.success('Successfully logged in');
      // queryClient.invalidateQueries(['current-user']);
      queryClient.setQueryData(['current-user'], data);
    },
    onError: (error) => {
      if (error instanceof Exception) toast.error(error.message);
      else toast.error('There was some error logging in.');
    },
  });

  return { login, isLoggingIn, userData };
};
