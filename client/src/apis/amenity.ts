import { Amenity, ServerError } from '../commonDataTypes';

export const getAmenity = async (): Promise<Amenity[]> => {
  const res = await fetch('/api/v1/amenity', {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-cache',
  });

  const data = res.json();

  if (!res.ok) {
    throw new ServerError('Unable to fetch amenities', res.status);
  }

  return data;
};
