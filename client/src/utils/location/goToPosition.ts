import { LatLngBounds, Map } from 'leaflet';

export const goToPosition = (
  position: LatLngBounds,
  map: Map,
  animate: boolean
) => {
  if (animate) {
    map.flyToBounds(position.pad(0.1));
  } else {
    map.fitBounds(position.pad(0.1));
  }
};
