import { isSameDay, addDays, subDays, compareAsc } from 'date-fns';

import { getInvalidCheckiInDates } from '../../../utils/dates/invalid-checkin-dates';
import { getTimeZoneDiff } from '../../../utils/dates/timezone-diff';
import { HomeDetails, HomeDetailsSchema } from '../types/HomeDetails';
import { customFetch } from '../../../utils/customFetch';

export const getHomeDetails = async (homeId: string): Promise<HomeDetails> => {
  const data = await customFetch(`/api/v1/home/${homeId}`, HomeDetailsSchema, {
    errorMessage: 'There was an error getting the home details',
  });

  const { time_zone, minDate, maxDate, ...rest } = data;
  const invalidCheckinDates = getInvalidCheckiInDates(
    data.bookings,
    data.number_of_cabins
  );

  const newInvalidCheckInDates: Date[] = [];

  let newMinDate = minDate;
  let newMaxDate = maxDate;

  const minStart = invalidCheckinDates.findIndex((val) =>
    isSameDay(val, minDate)
  );

  if (minStart !== -1) {
    newMinDate = addDays(newMinDate, 1);
    for (let i = minStart + 1; i < invalidCheckinDates.length; i++) {
      if (isSameDay(invalidCheckinDates[i], newMinDate)) {
        newMinDate = addDays(newMinDate, 1);
      } else {
        newInvalidCheckInDates.push(...invalidCheckinDates.slice(i));
        break;
      }
    }
  }

  const maxStart = invalidCheckinDates.findIndex((val) =>
    isSameDay(val, maxDate)
  );

  if (maxStart !== -1) {
    newMaxDate = subDays(newMaxDate, 1);
    for (let i = maxStart - 1; i >= 0; i--) {
      if (isSameDay(invalidCheckinDates[i], newMaxDate)) {
        newMaxDate = subDays(newMaxDate, 1);
      } else {
        break;
      }
    }
  }

  const homeData = {
    ...rest,
    unavailable: compareAsc(newMaxDate, newMinDate) <= 0,
    minDate: newMinDate,
    maxDate: newMaxDate,
    invalidCheckinDates: newInvalidCheckInDates,
    timezone_details: getTimeZoneDiff(
      data.time_zone.offset,
      data.time_zone.name
    ),
  };

  return homeData;
};
