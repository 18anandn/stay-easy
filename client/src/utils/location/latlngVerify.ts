import { whiteSpaceTrimmer } from '../whiteSpaceTrimmer';

export const latlngVerify = (str: unknown): boolean => {
  if (!str) return false;
  if (typeof str !== 'string') return false;
  const latlng = str.split(',').map((val) => whiteSpaceTrimmer(val));

  if (latlng.length !== 2) {
    return false;
  }
  if (latlng[0].length === 0 || latlng[1].length === 0) {
    return false;
  }

  const lat = Number(latlng[0]);
  const lng = Number(latlng[1]);
  if (isNaN(lat) || isNaN(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
    return false;
  }
  return true;
};
