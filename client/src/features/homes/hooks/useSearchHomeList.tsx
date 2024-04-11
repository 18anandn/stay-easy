import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useRef } from 'react';
import { getFindHomeParams, searchHomeList } from '../services/searchHome';
import { getLocation, addLocation } from '../../../map/utils/LocationStore';
import { useSearchParams } from 'react-router-dom';

export const useSearchHomeList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentParams = useMemo(
    () => getFindHomeParams(searchParams),
    [searchParams]
  );
  const totalCount = useRef<number>();
  const queryClient = useQueryClient();
  const tempParams = { ...currentParams };
  if (tempParams.address.length > 0) {
    const coords = getLocation(tempParams.address);
    if (coords) {
      const [lower, higher] = coords;
      tempParams.min = lower;
      tempParams.max = higher;
    }
  }
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['search-homes', { ...tempParams }],
    queryFn: async () => {
      const data = await searchHomeList(tempParams);
      if (!totalCount.current) {
        totalCount.current = data.count;
      } else if (totalCount.current !== data.count) {
        totalCount.current = data.count;
        // queryClient.removeQueries(['search-homes']);
      }
      if (tempParams.address.length > 0 && data.params.min && data.params.max) {
        addLocation(tempParams.address, [data.params.min, data.params.max]);
        tempParams.min = data.params.min;
        tempParams.max = data.params.max;
        queryClient.setQueryData(['search-homes', { ...tempParams }], data);
      }
      return data;
    },
  });

  return {
    data,
    isLoading,
    error,
    isError,
    searchParams,
    setSearchParams,
    currentParams,
  };
};
