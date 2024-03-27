import { BookingSort } from '../enums/BookingSort';

export type BookingSortOption = {
  label: string;
  value: {
    sortBy:  BookingSort;
    order: 'ASC' | 'DESC';
  };
};
