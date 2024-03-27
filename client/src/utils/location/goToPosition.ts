import { LatLng, LatLngBounds, Map, PointExpression } from 'leaflet';

const PADDING: PointExpression = [40, 50];
const ZOOM_LEVEL: number = 10;

export const goToPosition = (
  position: LatLngBounds | LatLng,
  map: Map,
  animate: boolean,
) => {
  if (position instanceof LatLngBounds) {
    if (animate) {
      map.flyToBounds(position, { padding: PADDING });
    } else {
      map.fitBounds(position, { padding: PADDING });
    }
  } else {
    if (animate) {
      map.flyTo(position, ZOOM_LEVEL);
    } else {
      map.setView(position, ZOOM_LEVEL);
    }
  }
};
