import { z } from 'zod';
import { customFetch } from '../../../utils/customFetch';

const OwnerHomeListInfoSchema = z.object({
  approved: z
    .object({
      id: z.string(),
      name: z.string(),
      main_image: z.string(),
      city: z.string(),
      country: z.string(),
    })
    .array(),
  pending: z
    .object({
      id: z.string(),
      name: z.string(),
      main_image: z.string(),
      address: z.string(),
    })
    .optional(),
  rejected: z
    .object({
      id: z.string(),
      name: z.string(),
      main_image: z.string(),
      address: z.string(),
      message: z.string(),
    })
    .optional(),
});

type OwnerHomeListInfo = z.infer<typeof OwnerHomeListInfoSchema>;

export const getOwnerHomeList = async (): Promise<OwnerHomeListInfo> => {
  const data = await customFetch('/api/v1/owner', OwnerHomeListInfoSchema, {
    errorMessage: 'There was an error loading your homes.',
  });

  return data;
};
