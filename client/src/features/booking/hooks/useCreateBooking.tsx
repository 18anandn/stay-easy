import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createBooking } from '../services/createBooking';

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const {
    mutate: bookingFn,
    error,
    isPending: isBooking,
    data: bookingData,
  } = useMutation({
    mutationFn: createBooking,
    onSuccess: (data, variables) => {
      queryClient.removeQueries({ queryKey: ['home-data', variables.homeId] });
      queryClient.removeQueries({ queryKey: ['trips'] });
      queryClient.removeQueries({ queryKey: ['search-homes'] });
    },
  });

  return { bookingFn, isBooking, error, bookingData };
};
