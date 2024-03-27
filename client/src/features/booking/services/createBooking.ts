import { Exception } from '../../../data/Exception';
import { tryCatchWrapper } from '../../../utils/tryCatchWrapper';

export type BookingDetails = {
  homeId: string;
  from_date: string;
  to_date: string;
  guests: number;
};

export type BookingRes = {
  bookingId: string;
};

export const createBooking = tryCatchWrapper(
  async (bookingDetails: BookingDetails): Promise<BookingRes> => {
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
      throw new Exception(
        data.message ?? 'There was an error while booking',
        res.status,
      );
    }

    return data;
  },
);
