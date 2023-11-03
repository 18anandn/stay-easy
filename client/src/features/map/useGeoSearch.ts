import { useMutation } from '@tanstack/react-query';
import { GeoCodingData, ServerError } from '../../commonDataTypes';
import { getLocation } from '../../apis/geocoding';

const useGeoSearch = () => {
  const {
    isLoading,
    mutate: searchLocation,
    data: locationData,
  } = useMutation<GeoCodingData, ServerError, string>({
    mutationFn: getLocation,
  });

  return { isLoading, searchLocation, locationData };
};

export default useGeoSearch;
