import { LatLng, LatLngBounds } from 'leaflet';

export const getBbox = (latlngPoints: LatLng[]): LatLngBounds => {
  let minLat = latlngPoints[0].lat;
  let minLng = latlngPoints[0].lng;
  let maxLat = latlngPoints[0].lat;
  let maxLng = latlngPoints[0].lng;

  // Iterate through the array to find the minimum and maximum latitude and longitude
  for (const point of latlngPoints) {
    minLat = Math.min(minLat, point.lat);
    minLng = Math.min(minLng, point.lng);
    maxLat = Math.max(maxLat, point.lat);
    maxLng = Math.max(maxLng, point.lng);
  }

  return new LatLngBounds(
    new LatLng(minLat, minLng),
    new LatLng(maxLat, maxLng),
  );
};
