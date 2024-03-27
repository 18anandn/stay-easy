import { useQuery } from '@tanstack/react-query';
import { getHomeDetails } from '../services/getHomeDetails';
import { Exception } from '../../../data/Exception';

const useGetHome = (homeId: string | undefined) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['home-data', homeId ?? 'none'],
    queryFn: () => {
      if (!homeId) throw new Exception('Invalid home requested', 400);
      return getHomeDetails(homeId);
    },
    // onError: (err) => {
    //   console.log(err);
    // },
    staleTime: Infinity,
  });

  return { data, isLoading, error };
};

export default useGetHome;
