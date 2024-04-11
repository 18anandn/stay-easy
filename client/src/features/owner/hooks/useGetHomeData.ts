import { useQuery } from '@tanstack/react-query';
import { getHomeData } from '../services/getHomeData';
import { Exception } from '../../../data/Exception';

export const useGetHomeData = (id: string | undefined) => {
  return useQuery({
    queryKey: ['owner-any-home-data', id],
    queryFn: () => {
      if (!id) {
        throw new Exception('ID of home missing', 400);
      }
      return getHomeData(id);
    },
  });
};
