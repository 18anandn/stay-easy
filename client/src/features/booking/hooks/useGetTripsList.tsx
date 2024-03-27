import { useInfiniteQuery } from '@tanstack/react-query';

import { getTripList, tripsSortOptions } from '../services/getTripList';

export const useGetTripsList = (sortBy: (typeof tripsSortOptions)[number]) => {
  const {
    data,
    fetchNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['trips', sortBy.value],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) => getTripList(pageParam, sortBy),
    getNextPageParam: (lastPage, allPages) => {
      // if (!lastPage) return undefined;
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
