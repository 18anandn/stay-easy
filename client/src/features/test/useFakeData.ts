import { useInfiniteQuery } from '@tanstack/react-query';
import { TestData, getFakeData } from '../../apis/test';

const useFakeData = () => {
  const { data, fetchNextPage, isLoading, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery<any, any, TestData[]>({
      queryKey: ['test-data'],
      queryFn: ({ pageParam = 1 }) => getFakeData(pageParam),
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length === 0 ? undefined : allPages.length + 1,
      staleTime: Infinity,
    });

  return { data, fetchNextPage, isLoading, isFetchingNextPage, hasNextPage };
};

export default useFakeData;
