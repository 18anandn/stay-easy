import { useQuery } from '@tanstack/react-query';

import { getCurrentUser } from '../services/getCurrentUser';

const useCurrentUser = () => {
  const { data: currentUser, ...rest } = useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
    staleTime: Infinity,
  });

  return { currentUser, ...rest };
};

export { useCurrentUser };
