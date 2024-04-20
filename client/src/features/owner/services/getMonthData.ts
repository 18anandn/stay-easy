import { customFetch } from '../../../utils/customFetch';
import { AnalyticsData, AnalyticsDataSchema } from '../types/AnalyticsData';

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
