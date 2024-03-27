import { useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '../services/getCurrentUser';

const useCurrentUser = () => {
  const {
    data: currentUser,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
    staleTime: Infinity,
  });

  return { isLoading, currentUser, isError, isSuccess };
};

export { useCurrentUser };
