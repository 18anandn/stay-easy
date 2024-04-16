import { useMutation } from '@tanstack/react-query';

import { login as loginApi } from '../services/login';

export const useLoginUser = () => {
  const {
    mutate: login,
    isPending: isLoggingIn,
    data: userData,
  } = useMutation({
    mutationFn: loginApi,
  });

  return { login, isLoggingIn, userData };
};
