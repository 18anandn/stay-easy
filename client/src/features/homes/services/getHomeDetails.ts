import { add, addDays, endOfMonth, startOfDay } from 'date-fns';
import { Exception } from '../../../data/Exception';
import { TimeZoneDetails } from '../../../types/TimeZoneDetails';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { getInvalidCheckiInDates } from '../../../utils/dates/invalid-checkin-dates';
import { getTimeZoneDiff } from '../../../utils/dates/timezone-diff';
import { tryCatchWrapper } from '../../../utils/tryCatchWrapper';

type HomeDetails = {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  description: string;
  price: number;
  price_per_guest: number;
  cabin_capacity: number;
  number_of_cabins: number;
  city: string;
  state: string;
  country: string;
  address: string;
  timezone_details: TimeZoneDetails;
  images: string[];
  amenities: string[];
  minDate: Date;
  maxDate: Date;
  invalidCheckInDates: Date[];
  bookings: [Date, Date][][];
};

export const getHomeDetails = tryCatchWrapper(
  async (homeId: string): Promise<HomeDetails> => {
    const url = `/api/v1/home/${homeId}`;
    const res = await fetch(url, {
      method: 'GET',
      cache: 'no-cache',
      mode: 'cors',
    });

    const data = await res.json();

    console.log(data);

    if (!res.ok) {
      throw new Exception(data.message, res.status);
    }

    const client_tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    data.minDate = addDays(
      startOfDay(
        utcToZonedTime(zonedTimeToUtc(new Date(), client_tz), data.time_zone)
      ),
      1
    );

    data.maxDate = startOfDay(
      endOfMonth(add(data.minDate, { years: 1, months: 1 }))
    );

    data.bookings = data.bookings.map((cabin: (string | number | Date)[][]) =>
      cabin.map((dates: (string | number | Date)[]) => [
        utcToZonedTime(dates[0], data.time_zone),
        utcToZonedTime(dates[1], data.time_zone),
      ])
    );

    data.invalidCheckInDates = getInvalidCheckiInDates(
      data.bookings,
      data.number_of_cabins
    );

    data.timezone_details = getTimeZoneDiff(data.time_zone);

    data.location = { lat: data.location[0], lng: data.location[1] };

    return data;
  }
);
