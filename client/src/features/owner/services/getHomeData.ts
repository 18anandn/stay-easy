import { Exception } from '../../../data/Exception';
import { tryCatchWrapper } from '../../../utils/tryCatchWrapper';

type HomeData = {
  name: string;
  city: string;
  state: string;
  country: string;
  address: string;
  location: [number, number];
  amenities?: string[];
  images: string[];
  revenue: number;
  total_bookings: number;
};

export const getHomeData = tryCatchWrapper(
  async (homeId: string): Promise<HomeData> => {
    const res = await fetch(`/api/v1/owner/${homeId}`, {
      cache: 'no-cache',
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Exception(
        data?.message ?? 'There was an error loading the home data.',
        res.status
      );
    }

    return data;
  }
);
