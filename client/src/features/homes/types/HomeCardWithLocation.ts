import { z } from 'zod';
import { HomeCardInfoSchema } from './HomeCardInfo';
import { zodLatLng } from '../../../utils/zodHelpers/zodLatLng';

export const HomeCardWithLocationSchema = HomeCardInfoSchema.extend({
  location: z.tuple([zodLatLng().shape.lat, zodLatLng().shape.lng]),
});

export type HomeCardWithLocation = z.infer<typeof HomeCardWithLocationSchema>;
