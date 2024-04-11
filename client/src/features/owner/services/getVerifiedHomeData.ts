import { z } from 'zod';
import { customFetch } from '../../../utils/customFetch';
import { OwnerHomeDataBase } from '../types/OwnerHomeDataBase';

const OwnerVerifiedHomeDataSchema = OwnerHomeDataBase.extend({
  city: z.string(),
  state: z.string(),
  country: z.string(),
  revenue: z.number({ coerce: true }),
  total_bookings: z.number({ coerce: true }).int(),
});

type OwnerHomeData = z.infer<typeof OwnerVerifiedHomeDataSchema>;

export const getVerifiedHomeData = async (
  homeId: string
): Promise<OwnerHomeData> => {
  const data = await customFetch(
    `/api/v1/owner/${homeId}`,
    OwnerVerifiedHomeDataSchema,
    {
      errorMessage: 'There was an error loading the home data.',
    }
  );

  return data;
};
