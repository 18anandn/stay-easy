import { z } from 'zod';
import { VerificationEnum } from '../../../enums/Verification.enum';
import { OwnerHomeDataBase } from '../types/OwnerHomeDataBase';
import { customFetch } from '../../../utils/customFetch';

const OwnerHomeDataSchema = z.discriminatedUnion('verification_status', [
  OwnerHomeDataBase.extend({
    verification_status: z
      .literal(VerificationEnum.Pending)
      .or(z.literal(VerificationEnum.Approved)),
  }),
  OwnerHomeDataBase.extend({
    message: z.string(),
    verification_status: z.literal(VerificationEnum.Rejected),
  }),
]);

type OwnerHomeData = z.infer<typeof OwnerHomeDataSchema>;

export const getHomeData = (id: string): Promise<OwnerHomeData> => {
  return customFetch(`/api/v1/owner/details/${id}`, OwnerHomeDataSchema, {
    errorMessage: 'There was an unknown error while fetching the data',
  });
};
