import { z } from 'zod';
import { StatsSchema } from '../types/Stats';
import { StatsWithTotalSchema } from '../types/StatsWithTotal';
import { customFetch } from '../../../utils/customFetch';

const AnalyticsDataSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  number_of_cabins: z.number({ coerce: true }).int(),
  number_of_bookings: z.number({ coerce: true }).int(),
  month_data: z
    .object({
      month: z.string(),
      occupancy: z.number({ coerce: true }).int(),
      revenue: z.number({ coerce: true }),
      guests: z.number({ coerce: true }).int(),
    })
    .array(),
  by_month_stats: z.object({
    occupancy: StatsSchema,
    revenue: StatsSchema,
    guests: StatsSchema,
  }),
  by_booking_stats: z.object({
    occupancy: StatsWithTotalSchema,
    revenue: StatsWithTotalSchema,
    guests: StatsWithTotalSchema,
  }),
});

type AnalyticsData = z.infer<typeof AnalyticsDataSchema>;

export const getMonthData = async (
  id: string,
  year: string
): Promise<AnalyticsData> => {
  const searchParam = new URLSearchParams();
  searchParam.set('year', year);
  const data = await customFetch(
    `/api/v1/owner/${id}/analytics?${searchParam.toString()}`,
    AnalyticsDataSchema,
    {
      errorMessage: 'There was an error in retrieving the data',
    }
  );

  return data;
};
