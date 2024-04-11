import { EnumValues } from '../types/EnumValues';

export const VerificationEnum = {
  Pending: 'pending',
  Rejected: 'rejected',
  Approved: 'approved',
} as const;

export type Verification = EnumValues<typeof VerificationEnum>;
