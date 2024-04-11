import { getInvalidCheckiInDates } from '../../../utils/dates/invalid-checkin-dates';
import { getTimeZoneDiff } from '../../../utils/dates/timezone-diff';
import { HomeDetails, HomeDetailsSchema } from '../types/HomeDetails';
import { customFetch } from '../../../utils/customFetch';

export const getHomeDetails = async (homeId: string): Promise<HomeDetails> => {
  const data = await customFetch(`/api/v1/home/${homeId}`, HomeDetailsSchema, {
    errorMessage: 'There was an error getting the home details',
  });

  const { time_zone, ...rest } = data;

  const homeData = {
    ...rest,
    invalidCheckinDates: getInvalidCheckiInDates(
      data.bookings,
      data.number_of_cabins
    ),
    timezone_details: getTimeZoneDiff(
      data.time_zone.offset,
      data.time_zone.name
    ),
  };


  return homeData;
};