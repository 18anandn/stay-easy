import { useInfiniteQuery } from '@tanstack/react-query';
import { HotelInfo, getHotels } from '../../apis/hotel';

const useGetHotels = () => {
  const { data, fetchNextPage, isLoading, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery<any, any, HotelInfo[]>({
      queryKey: ['test-data'],
      queryFn: ({ pageParam = 1 }) => getHotels(pageParam),
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length === 0 ? undefined : allPages.length + 1,
      staleTime: Infinity,
    });

  return { data, fetchNextPage, isLoading, isFetchingNextPage, hasNextPage };
};

export default useGetHotels;
