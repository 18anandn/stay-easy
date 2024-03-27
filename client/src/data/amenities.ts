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
];

export const AMENITIES_OPTIONS = AMENITIES_LIST.map((val) => ({
  value: val.toLowerCase(),
  label: val,
}));
