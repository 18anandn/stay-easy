export function getFormattedLocation(
  city: string,
  state: string,
  country: string,
) {
  if (city === state) return `${state}, ${country}`;
  return `${city}, ${state}, ${country}`;
}
