import { z } from 'zod';
import { TripSortOption } from '../types/TripSortOption';
import { customFetch } from '../../../utils/customFetch';
import { zodCustomDate } from '../../../utils/zodHelpers/zodCustomDate';

const TripPageSchema = z.object({
  trips: z
    .object({
      id: z.string(),
      from_date: zodCustomDate(),
      to_date: zodCustomDate(),
      // paid: z.number({ coerce: true }),
      home: z.object({
        // id: z.string().uuid(),
        name: z.string(),
        // time_zone: z.string(),
        city: z.string(),
        state: z.string(),
        country: z.string(),
        main_image: z.string().url(),
      }),
    })
    .array(),
  count: z.number({ coerce: true }).int(),
  items_per_page: z.number().int(),
});

type TripPage = {
  totalPages: number;
} & Omit<z.infer<typeof TripPageSchema>, 'items_per_page'>;

export const getTripList = async (
  page: number,
  sortBy: TripSortOption
): Promise<TripPage> => {
  const data = await customFetch(
    `/api/v1/booking/all?page=${page}&sortBy=${sortBy.value}`,
    TripPageSchema,
    {
      errorMessage: 'There was an error while fetching your trips',
    }
  );

  const { items_per_page, ...rest } = data;

  const tripData = {
    ...rest,
    totalPages: Math.ceil(data.count / items_per_page),
  };

  return tripData;
};
