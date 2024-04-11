import { useQuery } from '@tanstack/react-query';
import { getVerifiedHomeData } from '../services/getVerifiedHomeData';
import { Exception } from '../../../data/Exception';
import { useEffect } from 'react';
import { useSetHomeName } from '../providers/HomeProvider';

export const useGetVerifiedHomeData = (id: string | undefined) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['owner-home-data', id],
    queryFn: () => {
      if (!id) {
        throw new Exception('Invalid home id', 400);
      }
      return getVerifiedHomeData(id);
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
