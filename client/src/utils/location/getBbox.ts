export const getBbox = (
  latlngPoints: [number, number][]
): [[number, number], [number, number]] => {
  let minLat = latlngPoints[0][0];
  let minLng = latlngPoints[0][1];
  let maxLat = latlngPoints[0][0];
  let maxLng = latlngPoints[0][1];

  // Iterate through the array to find the minimum and maximum latitude and longitude
  for (const point of latlngPoints) {
    minLat = Math.min(minLat, point[0]);
    minLng = Math.min(minLng, point[1]);
    maxLat = Math.max(maxLat, point[0]);
    maxLng = Math.max(maxLng, point[1]);
  }

  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
};
