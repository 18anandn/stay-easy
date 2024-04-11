import { TripSortEnum } from '../enums/TripSort.enum';
import { TripSortOption } from '../types/TripSortOption';

export const tripsSortOptionList: TripSortOption[] = [
  { value: TripSortEnum.NEXT, label: 'Next Trip' },
  { value: TripSortEnum.RECENT, label: 'Recent Bookings' },
  { value: TripSortEnum.OLD, label: 'Old Trips' },
] as const;
