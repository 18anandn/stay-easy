import { useQuery } from '@tanstack/react-query';
import { Exception } from '../../../data/Exception';
import { getBookingList } from '../services/getBookingList';
import { BookingFilterOption } from '../types/BookingFilterOption';
import { BookingSortOption } from '../types/BookingSortOption';
import { useEffect } from 'react';
import { useSetHomeName } from '../providers/HomeProvider';

export const useGetBookingList = (
  id: string | undefined,
  filter: BookingFilterOption,
  sortBy: BookingSortOption | null,
  page: number
) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      'owner-booking-list',
      id,
      filter.value,
      sortBy?.value,
      sortBy?.value.order,
      page,
    ],
    enabled: id ? true : false,
    queryFn: () => {
      if (!id) {
        throw new Exception('Invalid id passed', 500);
      }
      return getBookingList(id, filter, sortBy, page);
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
