import { z } from 'zod';
import { TimeZoneDetails } from '../../../types/TimeZoneDetails';
import { toUTCDate } from '../../../utils/dates/toUTCDate';

export const HomeDetailsSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
  }),
  description: z.string(),
  price: z.number({ coerce: true }),
  price_per_guest: z.number({ coerce: true }),
  cabin_capacity: z.number({ coerce: true }).int(),
  number_of_cabins: z.number({ coerce: true }).int(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  address: z.string(),
  images: z.string().url().array(),
  amenities: z.string().array(),
  time_zone: z.object({
    name: z.string(),
    offset: z.number({ coerce: true }),
  }),
  bookings: z
    .tuple([
      z.date({ coerce: true }).transform((val) => toUTCDate(val)),
      z.date({ coerce: true }).transform((val) => toUTCDate(val)),
    ])
    .array()
    .array(),
  minDate: z.date({ coerce: true }).transform((val) => toUTCDate(val)),
  maxDate: z.date({ coerce: true }).transform((val) => toUTCDate(val)),
});

export type HomeDetails = Omit<
  z.infer<typeof HomeDetailsSchema>,
  'time_zone'
> & {
  unavailable: boolean;
  timezone_details: TimeZoneDetails;
  invalidCheckinDates: Date[];
};
