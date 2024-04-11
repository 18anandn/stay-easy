import { useQuery } from '@tanstack/react-query';
import { getOwnerHomeList } from '../services/getOwnerHomeList';

export const useGetOwnerHomeList = () => {
  const { data, isError, isLoading, error } = useQuery({
    queryKey: ['owner-home-list'],
    queryFn: getOwnerHomeList,
  });

  return { data, isError, error, isLoading };
};
