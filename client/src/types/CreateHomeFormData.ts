import { z } from 'zod';
import { latlngVerify } from '../utils/location/latlngVerify';
import { AMENITIES_LIST } from '../features/homes/data/amenities';
import { whiteSpaceTrimmer } from '../utils/whiteSpaceTrimmer';

const HomeNameRequired = 'Home name is required';
const HomeNameLength = 'Name should be 2-50 characters long';
const AddressRequired = 'Address is required';
const AddressLength = 'Address should be 3-90 character long';
const DescriptionRequired = 'Description is required';
const DescriptionLength = 'Description should be 10-1500 characters long';
const PriceRequired = 'Price is required';
const PricePerGuestRequired = 'Price per guest is required';

export const MIN_EXTRA_IMAGES = 4;
export const MAX_EXTRA_IMAGES = 10;

export const CreateHomeFormDataSchema = z.object({
  name: z
    .string({ required_error: HomeNameRequired })
    .min(2, HomeNameLength)
    .max(50, HomeNameLength),
  location: z
    .string()
    .min(1, 'Location is required')
    .refine((val) => latlngVerify(val), 'Provide valid coordinates')
    .transform((val) => whiteSpaceTrimmer(val)),
  address: z
    .string({ required_error: AddressRequired })
    .min(3, AddressLength)
    .max(90, AddressLength),
  price: z
    .string({ required_error: PriceRequired })
    .min(1, PriceRequired)
    .transform((value) => (value === '' ? null : value))
    .nullable()
    .refine((value) => value === null || !isNaN(Number(value)), {
      message: 'Price must be a number',
    }),
  price_per_guest: z
    .string({ required_error: PricePerGuestRequired })
    .min(1, PricePerGuestRequired)
    .transform((value) => (value === '' ? null : value))
    .nullable()
    .refine((value) => value === null || !isNaN(Number(value)), {
      message: 'Price per guest must be a number',
    }),
  number_of_cabins: z.number({ coerce: true }).int().min(1).max(50),
  cabin_capacity: z.number({ coerce: true }).int().min(1).max(50),
  amenities: z
    .enum(AMENITIES_LIST)
    .array()
    .max(AMENITIES_LIST.length)
    .default([]),
  description: z
    .string({ required_error: DescriptionRequired })
    .min(10, DescriptionLength)
    .max(1500, DescriptionLength),
  main_image: z.any().array().length(1, { message: 'Main image is required' }),
  extra_images: z
    .any()
    .array()
    .min(
      MIN_EXTRA_IMAGES,
      `Please select atleast ${MIN_EXTRA_IMAGES} extra images`
    )
    .max(MAX_EXTRA_IMAGES, `Max ${MAX_EXTRA_IMAGES} extra images allowed`),
});

export type CreateHomeFormData = Omit<
  z.infer<typeof CreateHomeFormDataSchema>,
  'main_image' | 'extra_images'
> & {
  main_image: File[];
  extra_images: File[];
};
