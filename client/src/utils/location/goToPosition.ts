import { LatLngBounds, Map, PointExpression } from 'leaflet';

const PADDING: PointExpression = [40, 50];
const ZOOM_LEVEL: number = 10;

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
