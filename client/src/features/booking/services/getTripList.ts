import { Exception } from '../../../data/Exception';
import { tryCatchWrapper } from '../../../utils/tryCatchWrapper';

type Trip = {
  id: string;
  from_date: string;
  to_date: string;
  paid: number;
  home: {
    id: string;
    name: string;
    time_zone: string;
    city: string;
    state: string;
    country: string;
    main_image: string;
  };
};

type TripPage = {
  trips: Trip[];
  count: number;
  totalPages: number;
};

export const tripsSortOptions = [
  { value: 'next', label: 'Next Trip' },
  { value: 'recent', label: 'Recent Bookings' },
  { value: 'old', label: 'Old Trips' },
];

export const getTripList = tryCatchWrapper(
  async (
    page: number,
    sortBy: (typeof tripsSortOptions)[number],
  ): Promise<TripPage> => {
    const res = await fetch(
      `/api/v1/booking/all?page=${page}&sortBy=${sortBy.value}`,
      {
        method: 'GET',
        cache: 'no-cache',
      },
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Exception(
        data.message ?? 'There was an error while booking',
        res.status,
      );
    }

    return {
      trips: data.trips,
      count: data.count,
      totalPages: Math.ceil(data.count / data.items_per_page),
    };
  },
);
