import { useQuery } from '@tanstack/react-query';
import {
  HomeListParams,
  formKey,
  getHomeList,
} from '../services/getHomeList';

export const useGetHomeList = (params: HomeListParams) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['home-list', ...formKey(params)],
    queryFn: () => getHomeList(params),
  });

  return { data, isLoading, isError, error };
};
