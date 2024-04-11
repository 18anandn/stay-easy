import { z } from 'zod';
import { HomeCardInfoSchema } from '../types/HomeCardInfo';
import { customFetch } from '../../../utils/customFetch';

const HomePageSchema = z.object({
  homes: HomeCardInfoSchema.array(),
  count: z.number({ coerce: true }).int(),
  items_per_page: z.number({ coerce: true }).int(),
});

type HomePage = {
  totalPages: number;
} & Omit<z.infer<typeof HomePageSchema>, 'count' | 'items_per_page'>;

export const getHomeList = async (page: number): Promise<HomePage> => {
  const data = await customFetch(`api/v1/home?page=${page}`, HomePageSchema, {
    errorMessage: 'There was an erro fetching the homes',
  });

  const { count, items_per_page, ...rest } = data;

  return {
    ...rest,
    totalPages: Math.ceil(count / items_per_page),
  };
};
