import { Exception } from '../../../data/Exception';
import { tryCatchWrapper } from '../../../utils/tryCatchWrapper';

export type OwnerHomeInfo = {
  id: string;
  name: string;
  main_image: string;
  city: string;
  country: string;
};

export const getOwnerHomeList = tryCatchWrapper(
  async (): Promise<OwnerHomeInfo[]> => {
    const res = await fetch('/api/v1/owner', {
      cache: 'no-cache',
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Exception(
        data?.message ?? 'There was an error loading your homes.',
        res.status,
      );
    }

    return data.data;
  },
);
