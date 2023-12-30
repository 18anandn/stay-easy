import { useQuery } from '@tanstack/react-query';
import { HotelInfo, getHome } from '../../apis/hotel';
import { ServerError } from '../../commonDataTypes';

const useGetHome = (homeId: string) => {
  const { data, isLoading, error } = useQuery<HotelInfo, ServerError>({
    queryKey: ['home-data', homeId],
    queryFn: () => {
      return getHome(homeId);
    },
    onError: (err) => {
      console.log(err)
    },
    staleTime: Infinity,
  });

  return { data, isLoading, error };
};

export default useGetHome;
