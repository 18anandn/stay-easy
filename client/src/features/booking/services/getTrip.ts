import { Exception } from '../../../data/Exception';
import { tryCatchWrapper } from '../../../utils/tryCatchWrapper';

type Trip = {
  id: string;
  from_date: string;
  to_date: string;
  paid: number;
  guests: number;
  home: {
    id: string;
    name: string;
    time_zone: string;
    city: string;
    state: string;
    country: string;
    address: string;
    main_image: string;
    location: {
      lat: number;
      lng: number;
    };
  };
};

export const getTrip = tryCatchWrapper(
  async (tripId: string): Promise<Trip> => {
    const res = await fetch(`/api/v1/booking/${tripId}`, {
      method: 'GET',
      cache: 'no-cache',
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Exception(
        data.message ?? 'There was an error while booking',
        res.status,
      );
    }

    return data;
  },
);
