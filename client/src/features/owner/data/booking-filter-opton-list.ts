import { BookingFilter } from '../enums/BookingFilter';
import { BookingFilterOption } from '../types/BookingFilterOption';

export const bookingFilterOptionList: BookingFilterOption[] = [
  { label: 'Checking in today', value: BookingFilter.CHECK_IN_TODAY },
  { label: 'Checking out today', value: BookingFilter.CHECK_OUT_TODAY },
  { label: 'Ongoing', value: BookingFilter.ONGOING },
  { label: 'Past Check-ins', value: BookingFilter.PAST },
  { label: 'Upcoming Check-ins', value: BookingFilter.UPCOMING },
  { label: 'All', value: BookingFilter.ALL },
];
