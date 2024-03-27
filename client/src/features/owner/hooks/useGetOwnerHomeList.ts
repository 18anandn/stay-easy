import { useQuery } from '@tanstack/react-query';
import { OwnerHomeInfo, getOwnerHomeList } from '../services/getOwnerHomeList';

export const useGetOwnerHomeList = () => {
  const { data, isError, isLoading, error } = useQuery<OwnerHomeInfo[]>({
    queryKey: ['owner-home-list'],
    queryFn: getOwnerHomeList,
  });

  return { data, isError, error, isLoading };
};
