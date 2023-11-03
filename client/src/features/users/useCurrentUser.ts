import { useQuery } from '@tanstack/react-query';

import { LoginRes, ServerError } from '../../commonDataTypes';
import { getCurrentUser } from '../../apis/user';

const useCurrentUser = () => {
  const {
    data: currentUser,
    isLoading,
    isError,
    isSuccess,
  } = useQuery<LoginRes | null, ServerError>({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
    staleTime: Infinity,
  });

  return { isLoading, currentUser, isError, isSuccess };
};

export { useCurrentUser };
