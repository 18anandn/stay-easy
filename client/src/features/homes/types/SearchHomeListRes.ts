import { LatLng, LatLngBounds } from "leaflet";
import { SearchHomeListParams } from "./SearchHomeListParams";
import { HomeCardWithLocation } from "./HomeCardWithLocation";

export type SearchHomeListRes = {
  homes: HomeCardWithLocation[];
  params: SearchHomeListParams;
  min?: string;
  max?: string;
  bounds?: LatLngBounds | LatLng;
  count: number;
  items_per_page: number;
  totalPages: number;
};
