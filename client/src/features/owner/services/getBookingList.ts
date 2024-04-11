import { z } from 'zod';
import { BookingFilterOption } from '../types/BookingFilterOption';
import { BookingSortOption } from '../types/BookingSortOption';
import { toUTCDate } from '../../../utils/dates/toUTCDate';
import { customFetch } from '../../../utils/customFetch';

const BookingListSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  bookingList: z
    .object({
      id: z.string(),
      from_date: z.date({ coerce: true }).transform((val) => toUTCDate(val)),
      to_date: z.date({ coerce: true }).transform((val) => toUTCDate(val)),
      user: z.string(),
    })
    .array(),
  count: z.number({ coerce: true }).int(),
  items_per_page: z.number({ coerce: true }).int(),
});

type BookingList = z.infer<typeof BookingListSchema> & {
  totalPages: number;
};

export const getBookingList = async (
  id: string,
  filter: BookingFilterOption,
  sortBy: BookingSortOption | null,
  page: number
): Promise<BookingList> => {
  const searchParam = new URLSearchParams();
  searchParam.set('filter', filter.value);
  if (sortBy) {
    searchParam.set('sortBy', sortBy.value.sortBy);
    searchParam.set('order', sortBy.value.order);
  }
  searchParam.set('page', page.toString());
  const url = `/api/v1/owner/${id}/booking?${searchParam.toString()}`;
  const data = await customFetch(url, BookingListSchema, {
    errorMessage: 'There was an error in fetching the data',
  });

  return {
    ...data,
    totalPages: Math.ceil(data.count / data.items_per_page),
  };
};
