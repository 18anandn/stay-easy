import { Exception } from '../../../data/Exception';
import { tryCatchWrapper } from '../../../utils/tryCatchWrapper';

export enum Verification {
  Pending = 'pending',
  Rejected = 'rejected',
  Approved = 'approved',
}

export const VERIFICATION_OPTIONS = Object.keys(Verification).map((key) => ({
  label: key,
  value: (Verification as any)[key],
}));

export type UpdatedHomeData = {
  id: string;
  time_zone?: string;
  city?: string;
  state?: string;
  country?: string;
  postcode?: string;
  verification_status: Verification;
  message?: string;
};

export const updateHomeData = tryCatchWrapper(
  async (params: UpdatedHomeData): Promise<void> => {
    const { id, ...rest } = params;

    const res = await fetch(`/api/v1/admin/home/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rest),
      method: 'PATCH',
      cache: 'no-cache',
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Exception(
        data?.message ?? 'There was an error while updating the data',
        res.status,
      );
    }
  },
);
