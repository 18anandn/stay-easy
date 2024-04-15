import { EnumValues } from './../../../types/EnumValues';

export const BookingFilterEnum = {
  CHECK_IN_TODAY: 'check-in',
  CHECK_OUT_TODAY: 'check-out',
  ONGOING: 'ongoing',
  PAST: 'past',
  UPCOMING: 'upcoming',
  ALL: 'all',
} as const;

export type BookingFilter = EnumValues<typeof BookingFilterEnum>;
