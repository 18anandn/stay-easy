import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateHomeData } from '../services/updateHomeData';

export const useUpdateHomeData = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: updateHomeData,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['home-data-for-verification'] });
    },
  });

  return { mutate, isPending, isError, error };
};
