import { Exception } from '../../../data/Exception';
import { tryCatchWrapper } from '../../../utils/tryCatchWrapper';
import { BookingFilterOption } from '../types/BookingFilterOption';
import { BookingSortOption } from '../types/BookingSortOption';

export const getBookingList = tryCatchWrapper(
  async (
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
    const res = await fetch(url, {
      cache: 'no-cache',
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Exception(
        data.message ?? 'There was an error in fetching the data',
        res.status
      );
    }

    data.totalPages = Math.ceil(data.count / data.items_per_page);

    return data;
  }
);

type BookingList = {
  id: string;
  name: string;
  bookingList: {
    id: string;
    from_date: string;
    to_date: string;
    user: string;
  }[];
  count: number;
  items_per_page: number;
  totalPages: number;
};
