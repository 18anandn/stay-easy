import { EnumValues } from '../../../types/EnumValues';

export const BookingSortEnum = {
  CHECK_IN: 'check-in',
  BOOKING: 'booking',
} as const;

export type BookingSort = EnumValues<typeof BookingSortEnum>;
