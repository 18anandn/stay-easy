import { useQuery } from '@tanstack/react-query';
import { Amenity, ServerError } from '../../commonDataTypes';
import { getAmenity } from '../../apis/amenity';

export const useGetAmenity = () => {
  const { isLoading, data: amenities } = useQuery<Amenity[], ServerError>({
    queryKey: ['amenities'],
    queryFn: getAmenity,
  });

  return { isLoading, amenities };
};
