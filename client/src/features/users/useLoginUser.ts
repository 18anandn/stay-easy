import { useMutation, useQueryClient } from '@tanstack/react-query';
import { loginUser } from '../../apis/user';
import { toast } from 'react-hot-toast';
import { LoginCreds, LoginRes, ServerError } from '../../commonDataTypes';

const useLoginUser = () => {
  const queryClient = useQueryClient();
  const {
    mutate: loginFn,
    isLoading: isLoggingIn,
    data: userData,
  } = useMutation<LoginRes, ServerError, LoginCreds>({
    mutationFn: async (query) => {
      const data = await loginUser(query);
      return data;
    },
    onSuccess: (data) => {
      toast.success('Successfully logged in');
      // queryClient.invalidateQueries(['current-user']);
      queryClient.setQueryData(['current-user'], { userId: data.userId });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return { loginFn, isLoggingIn, userData };
};

export default useLoginUser;
