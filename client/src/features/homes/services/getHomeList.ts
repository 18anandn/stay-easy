import { Exception } from '../../../data/Exception';
import { tryCatchWrapper } from '../../../utils/tryCatchWrapper';
import { HomeCardInfo } from '../types/HomeCardInfo';

type HomePage = {
  homes: HomeCardInfo[];
  totalPages: number;
};

export const getHomeList = tryCatchWrapper(
  async (page: number): Promise<HomePage> => {
    const res = await fetch(`api/v1/home?page=${page}`, {
      method: 'GET',
      cache: 'no-cache',
      mode: 'cors',
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Exception(data.message, res.status);
    }

    return data;
  },
);
