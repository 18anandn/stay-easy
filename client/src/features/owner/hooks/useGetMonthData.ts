import { useQuery } from '@tanstack/react-query';
import { getMonthData } from '../services/getMonthData';
import { Exception } from '../../../data/Exception';
import { useEffect } from 'react';
import { useSetHomeName } from '../providers/HomeProvider';

export const useGetMonthData = (id: string | undefined, year: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['month-analytics', id, year],
    enabled: id ? true : false,
    queryFn: () => {
      if (!id) {
        throw new Exception('Invalid home id', 400);
      }
      return getMonthData(id, year);
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
