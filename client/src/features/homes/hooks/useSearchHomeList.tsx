import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useContext, useRef } from 'react';
import { SearchHomeListParams } from '../types/SearchHomeListParams';
import { searchHomeList } from '../services/searchHome';
import { LocationContext } from '../../../map/components/LocationContext';

export const useSearchHomeList = (params: SearchHomeListParams) => {
  const totalCount = useRef<number>();
  const queryClient = useQueryClient();
  const { getLocation, addLocation } = useContext(LocationContext);
  // if(params.address.length > 0) {
  //   const [lower, higher] = getLocation(params.address);
  //   params.min = lower;
  //   params.max = higher;
  // }
  const { data, isLoading, error, isError } = useQuery({
    queryKey: ['search-homes', ...formKey(params)],
    queryFn: async () => {
      const data = await searchHomeList(params);
      if (!totalCount.current) {
        totalCount.current = data.count;
      } else if (totalCount.current !== data.count) {
        totalCount.current = data.count;
        // queryClient.removeQueries(['search-homes']);
      }
      if (params.address.length > 0 && data.min && data.max) {
        addLocation(params.address, [data.min, data.max]);
        params.min = data.min;
        params.max = data.max;
        queryClient.setQueryData(['search-homes', ...formKey(params)], data);
        params.min = '';
        params.max = '';
        queryClient.setQueryData(['search-homes', ...formKey(params)], data);
      }
      return data;
    },
  });

  return { data, isLoading, error, isError };
};

const formKey = (param: SearchHomeListParams): any[] => {
  const {
    address,
    country,
    dates,
    distance,
    min,
    max,
    amenities,
    sortBy,
    order,
    page,
  } = param;

  const keys: [
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    string,
    number
  ] = [
    address,
    country,
    dates,
    distance,
    min,
    max,
    amenities.sort().join(','),
    sortBy,
    order,
    page,
  ];
  
  return keys;
};
