import { BookingFilterEnum } from '../enums/BookingFilter';
import { BookingFilterOption } from '../types/BookingFilterOption';

export const bookingFilterOptionList: BookingFilterOption[] = [
  { label: 'Checking in today', value: BookingFilterEnum.CHECK_IN_TODAY },
  { label: 'Checking out today', value: BookingFilterEnum.CHECK_OUT_TODAY },
  { label: 'Ongoing', value: BookingFilterEnum.ONGOING },
  { label: 'Past Check-ins', value: BookingFilterEnum.PAST },
  { label: 'Upcoming Check-ins', value: BookingFilterEnum.UPCOMING },
  { label: 'All', value: BookingFilterEnum.ALL },
];
