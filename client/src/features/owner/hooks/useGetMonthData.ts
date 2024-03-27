import { useQuery } from '@tanstack/react-query';
import { getMonthData } from '../services/getMonthData';
import { Exception } from '../../../data/Exception';
import { useContext, useEffect } from 'react';
import { HomeContext } from '../context/HomeContextProvider';

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
  const { setHomeName } = useContext(HomeContext);
  useEffect(() => {
    if (data) {
      setHomeName(data.name);
    }
  }, [data, setHomeName]);

  return { data, isLoading, isError, error };
};
