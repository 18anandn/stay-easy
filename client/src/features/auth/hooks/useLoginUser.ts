import { useMutation, useQueryClient } from '@tanstack/react-query';

import { login as loginApi } from '../services/login';

export const useLoginUser = () => {
  const queryClient = useQueryClient();
  const {
    mutate: login,
    isPending: isLoggingIn,
    data: userData,
  } = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      queryClient.setQueryData(['current-user'], data);
    },
  });

  return { login, isLoggingIn, userData };
};
