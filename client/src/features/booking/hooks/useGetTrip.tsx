import { useQuery } from '@tanstack/react-query';
import { getTrip } from '../services/getTrip';

export const useGetTrip = (tripId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: () => getTrip(tripId),
    staleTime: Infinity,
  });

  return {
    data,
    isLoading,
    error,
  };
};
