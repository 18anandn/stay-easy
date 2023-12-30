import { ServerError } from '../commonDataTypes';

export type BookingDetails = {
  hotelId: string;
  from_date: string;
  to_date: string;
  guests: number;
};

export type BookingRes = {
  bookingId: string;
};

export const createBooking = async (
  bookingDetails: BookingDetails,
): Promise<BookingRes> => {
  const res = await fetch('/api/v1/booking', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-cache',
    body: JSON.stringify(bookingDetails),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ServerError(
      data.message ?? 'There was an error while booking',
      res.status,
    );
  }

  return data;
};

export type Trip = {
  id: string;
  from_date: string;
  to_date: string;
  hotel: {
    name: string;
    city: string;
    state: string;
    main_image: string;
  };
};

export type TripPage = {
  trips: Trip[];
  count: number;
  totalPages: number;
};

export const getTrips = async (page?: number): Promise<TripPage> => {
  const current_page = page ?? 1;
  const res = await fetch(`/api/v1/booking/all?page=${current_page}`, {
    method: 'GET',
    cache: 'no-cache',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ServerError(
      data.message ?? 'There was an error while booking',
      res.status,
    );
  }

  return {
    trips: data.trips,
    count: data.count,
    totalPages: data.totalPages,
  };
};
