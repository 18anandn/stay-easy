import { Exception } from '../../../data/Exception';
import { tryCatchWrapper } from '../../../utils/tryCatchWrapper';
import { Stats } from '../types/Stats';
import { StatsWithTotal } from '../types/StatsWithTotal';

export const getMonthData = tryCatchWrapper(
  async (id: string, year: string): Promise<AnalyticsData> => {
    const searchParam = new URLSearchParams();
    searchParam.set('year', year);
    const res = await fetch(
      `/api/v1/owner/${id}/analytics?${searchParam.toString()}`,
      {
        cache: 'no-cache',
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Exception(
        data.message ?? 'There was an error in retrieving the data',
        res.status
      );
    }

    return data;
  }
);

type AnalyticsData = {
  id: string;
  name: string;
  number_of_cabins: number;
  number_of_bookings: number;
  month_data: {
    month: string;
    occupancy: number;
    revenue: number;
    guests: number;
  }[];
  by_month_stats: {
    occupancy: Stats;
    revenue: Stats;
    guests: Stats;
  };
  by_booking_stats: {
    occupancy: StatsWithTotal;
    revenue: StatsWithTotal;
    guests: StatsWithTotal;
  };
};
