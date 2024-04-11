import { z } from 'zod';
import { customFetch } from '../../../utils/customFetch';

export type BookingDetails = {
  homeId: string;
  from_date: string;
  to_date: string;
  guests: number;
};

export const createBooking = async (
  bookingDetails: BookingDetails
): Promise<void> => {
  await customFetch('/api/v1/booking', z.any(), {
    errorMessage: 'There was an error while booking',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingDetails),
  });
};
