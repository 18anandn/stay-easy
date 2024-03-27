import { useQuery } from '@tanstack/react-query';
import { getHomeData } from '../services/getHomeData';

export const useGetHomeData = (homeId: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['home-data-for-verification', homeId],
    queryFn: () => getHomeData(homeId),
  });

  return { data, isLoading, isError, error };
};
