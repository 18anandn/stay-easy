import { SearchHomeListParams } from './SearchHomeListParams';
import { HomeCardWithLocationSchema } from './HomeCardWithLocation';
import { z } from 'zod';
import { zodLatLng } from '../../../utils/zodHelpers/zodLatLng';

export const SearchHomeListResSchema = z.object({
  homes: HomeCardWithLocationSchema.array(),
  bounds: z
    .tuple([
      z.tuple([zodLatLng().shape.lat, zodLatLng().shape.lng]),
      z.tuple([zodLatLng().shape.lat, zodLatLng().shape.lng]),
    ])
    .optional(),
  count: z.number({ coerce: true }).int(),
  items_per_page: z.number({ coerce: true }).int(),
});

export type SearchHomeListRes = z.infer<typeof SearchHomeListResSchema> & {
  params: SearchHomeListParams;
  // min?: string;
  // max?: string;
  totalPages: number;
};
