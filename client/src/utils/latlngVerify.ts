export const latlngVerify = (val: string): boolean | string => {
  const errorMessage = 'Location must be valid coordinates (Latitude, Longitude)';
  const latlng = val.replace(' ', '').split(',');
  if (latlng.length !== 2) {
    return errorMessage;
  }
  if (
    latlng[0].length === 0 ||
    isNaN(latlng[0] as any) ||
    latlng[1].length === 0 ||
    isNaN(latlng[1] as any)
  ) {
    return errorMessage;
  }

  const lat = parseFloat(latlng[0])
  const lng = parseFloat(latlng[1])
  if (Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return errorMessage;
  }
  return true;
};
