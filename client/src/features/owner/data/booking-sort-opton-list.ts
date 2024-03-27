import { BookingSort } from '../enums/BookingSort';
import { BookingSortOption } from '../types/BookingSortOption';

export const bookingSortOptionList: BookingSortOption[] = [
  {
    label: 'Latest check-in',
    value: { sortBy: BookingSort.CHECK_IN, order: 'DESC' },
  },
  {
    label: 'Oldest check-in',
    value: { sortBy: BookingSort.CHECK_IN, order: 'ASC' },
  },
  {
    label: 'Latest booking',
    value: { sortBy: BookingSort.BOOKING, order: 'DESC' },
  },
  {
    label: 'Oldest booking',
    value: { sortBy: BookingSort.BOOKING, order: 'ASC' },
  },
];
