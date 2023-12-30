import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ServerError } from '../../commonDataTypes';
import { BookingDetails, BookingRes, createBooking } from '../../apis/booking';

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const {
    mutate: bookingFn,
    error,
    isLoading: isBooking,
    data: bookingData,
  } = useMutation<BookingRes, ServerError, BookingDetails>({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries(['trips']);
    },
  });

  return { bookingFn, isBooking, error, bookingData };
};
