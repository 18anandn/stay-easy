import { useInfiniteQuery } from '@tanstack/react-query';
import { TripPage, getTrips } from '../../apis/booking';

export const useGetTrips = () => {
  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery<any, any, TripPage>({
    queryKey: ['trips'],
    queryFn: ({ pageParam = 1 }) => {
      return getTrips(pageParam);
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.totalPages > allPages.length
        ? allPages.length + 1
        : undefined;
    },
    staleTime: Infinity,
  });

  return {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
  };
};
