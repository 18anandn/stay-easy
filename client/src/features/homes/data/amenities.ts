import { SelectOption } from '../../../types/SelectOptions';

export const AMENITIES_LIST = [
  'AC',
  'Bath tub',
  'BBQ grill',
  'Breakfast',
  'Free parking',
  'Gym',
  'Hair dryer',
  'Heating',
  'Iron',
  'Pool',
  'TV',
  'Washing Machine',
  'Wi-fi',
  'Workspace',
] as const;

type Amenity = (typeof AMENITIES_LIST)[number];

export const AMENITIES_OPTIONS: ReadonlyArray<SelectOption<Amenity, Amenity>> =
  AMENITIES_LIST.map((val) => ({
    value: val,
    label: val,
  }));
