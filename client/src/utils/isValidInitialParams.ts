import { isMatch, compareAsc, addDays } from 'date-fns';

import {
  CHECK_IN,
  CHECK_OUT,
  GUESTS,
  DATE_FORMAT_NUM,
  MAX_DATE_RANGE,
} from '../data/constants';
import { getMaxCheckOutDate } from './dates/max-checkout-date';
import { HomeDetails } from '../features/homes/types/HomeDetails';
import { toUTCDate } from './dates/toUTCDate';

export const isValidInitialParams = (
  searchParamsOnInitialLoad: URLSearchParams,
  data: HomeDetails
): boolean => {
  const start_date_param = searchParamsOnInitialLoad.get(CHECK_IN);
  const end_date_param = searchParamsOnInitialLoad.get(CHECK_OUT);
  const guests_param = searchParamsOnInitialLoad.get(GUESTS);

  let start_date: Date | undefined = undefined;
  if (start_date_param) {
    if (isMatch(start_date_param, DATE_FORMAT_NUM)) {
      start_date = toUTCDate(start_date_param);
    }

    if (
      !start_date ||
      compareAsc(start_date, data.minDate) < 0 ||
      compareAsc(start_date, data.maxDate) > 0 ||
      data.invalidCheckinDates.some(
        (date) => start_date && date.getTime() === start_date.getTime()
      )
    ) {
      return false;
    }
  }

  let end_date: Date | undefined = undefined;
  if (end_date_param) {
    if (isMatch(end_date_param, DATE_FORMAT_NUM)) {
      end_date = toUTCDate(end_date_param);
    }

    if (
      !start_date ||
      !end_date ||
      compareAsc(end_date, start_date) <= 0 ||
      compareAsc(end_date, addDays(start_date, MAX_DATE_RANGE)) > 0 ||
      compareAsc(
        end_date,
        getMaxCheckOutDate(start_date, MAX_DATE_RANGE, data.bookings)
      ) > 0
    ) {
      return false;
    }
  }

  if (guests_param) {
    let guests = Number(guests_param);
    if (
      isNaN(guests) ||
      !isFinite(guests) ||
      !Number.isInteger(guests) ||
      guests > data.cabin_capacity
    ) {
      return false;
    }
  }

  return true;
};
