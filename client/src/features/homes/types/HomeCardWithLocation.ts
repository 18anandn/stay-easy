import { z } from 'zod';
import { HomeCardInfoSchema } from './HomeCardInfo';
import { zodLatLng } from '../../../utils/zodHelpers/zodLatLng';
import { LatLng } from 'leaflet';

export const HomeCardWithLocationSchema = HomeCardInfoSchema.extend({
  location: z.tuple([zodLatLng().shape.lat, zodLatLng().shape.lng]),
});

export type HomeCardWithLocation = Omit<
  z.infer<typeof HomeCardWithLocationSchema>,
  'location'
> & {
  location: LatLng;
};
