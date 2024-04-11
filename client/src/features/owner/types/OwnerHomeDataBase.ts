import { z } from "zod";
import { zodLatLng } from "../../../utils/zodHelpers/zodLatLng";

export const OwnerHomeDataBase = z.object({
  name: z.string(),
  location: zodLatLng(),
  address: z.string(),
  number_of_cabins: z.number({ coerce: true }).int(),
  cabin_capacity: z.number({ coerce: true }).int(),
  images: z.string().url().array(),
  amenities: z.string().array().optional(),
});
