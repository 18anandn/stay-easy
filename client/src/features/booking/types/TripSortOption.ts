import { EnumValues } from '../../../types/EnumValues';
import { SelectOption } from '../../../types/SelectOptions';
import { TripSortEnum } from '../enums/TripSort.enum';

export type TripSortOption = SelectOption<
  EnumValues<typeof TripSortEnum>,
  string
>;
