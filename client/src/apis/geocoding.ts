import { GeoCodingData, ServerError } from '../commonDataTypes';

export const getLocation = async (address: string): Promise<GeoCodingData> => {
  if (address.length < 3) {
    throw new ServerError('Search string should be atleast 3 chars long', 401);
  }
  const res = await fetch(
    `/api/v1/geocoding/search?${new URLSearchParams({ address }).toString()}`,
    {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new ServerError(data.message ?? 'There was an error during search', res.status);
  }

  return data;
};
