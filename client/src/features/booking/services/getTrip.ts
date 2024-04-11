import { z } from 'zod';
import { customFetch } from '../../../utils/customFetch';
import { zodCustomDate } from '../../../utils/zodHelpers/zodCustomDate';
import { zodLatLng } from '../../../utils/zodHelpers/zodLatLng';

const TripSchema = z.object({
  id: z.string(),
  from_date: zodCustomDate(),
  to_date: zodCustomDate(),
  paid: z.number({ coerce: true }),
  guests: z.number({ coerce: true }).int(),
  home: z.object({
    id: z.string().uuid(),
    name: z.string(),
    time_zone: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    address: z.string(),
    main_image: z.string().url(),
    location: zodLatLng(),
  }),
});

type Trip = z.infer<typeof TripSchema>;

export const getTrip = async (tripId: string): Promise<Trip> => {
  const data = await customFetch(`/api/v1/booking/${tripId}`, TripSchema, {
    errorMessage: 'There was an error while fetching the trips',
  });

  return data;
};
