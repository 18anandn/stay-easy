import { useInfiniteQuery } from '@tanstack/react-query';
import { getHomeList } from '../services/getHomeList';

const useGetHotels = () => {
  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['hotels-data'],
    queryFn: ({ pageParam }) => getHomeList(pageParam),
    initialPageParam: 1,
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

export default useGetHotels;
