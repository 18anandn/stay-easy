import { useMutation } from '@tanstack/react-query';
import { CreateHotelFormData, ServerError } from '../../commonDataTypes';
import { createHotel as createHotelApi } from '../../apis/hotel';

export const useCreateHotel = () => {
  const {
    isLoading,
    data,
    mutate: createHotel,
  } = useMutation<any, ServerError, CreateHotelFormData>({
    mutationFn: createHotelApi,
  });

  return { isLoading, data, createHotel };
};
