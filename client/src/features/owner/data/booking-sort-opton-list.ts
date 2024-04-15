import { BookingSortEnum } from '../enums/BookingSort';
import { BookingSortOption } from '../types/BookingSortOption';

export const bookingSortOptionList: BookingSortOption[] = [
  {
    label: 'Latest check-in',
    value: { sortBy: BookingSortEnum.CHECK_IN, order: 'DESC' },
  },
  {
    label: 'Oldest check-in',
    value: { sortBy: BookingSortEnum.CHECK_IN, order: 'ASC' },
  },
  {
    label: 'Latest booking',
    value: { sortBy: BookingSortEnum.BOOKING, order: 'DESC' },
  },
  {
    label: 'Oldest booking',
    value: { sortBy: BookingSortEnum.BOOKING, order: 'ASC' },
  },
];
