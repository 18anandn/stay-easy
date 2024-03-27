import { useQuery } from '@tanstack/react-query';
import { getHomeData } from '../services/getHomeData';
import { Exception } from '../../../data/Exception';
import { useEffect } from 'react';
import { useSetHomeName } from '../providers/HomeProvider';

export const useGetHomeData = (id: string | undefined) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['owner-home-data', id],
    queryFn: () => {
      if (!id) {
        throw new Exception('Invalid home id', 400);
      }
      return getHomeData(id);
    },
  });
  
  const setHomeName = useSetHomeName();
  useEffect(() => {
    if (data) {
      setHomeName(data.name);
    }
  }, [data, setHomeName]);

  return { data, isLoading, isError, error };
};
