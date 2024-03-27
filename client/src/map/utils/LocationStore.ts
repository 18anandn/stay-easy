const locationMap = new Map<string, [string, string]>();

export const getLocation = (address: string): [string, string] => {
  return (
    locationMap.get(address.trim().replace(/\s+/g, ' ').toLowerCase()) ?? [
      '',
      '',
    ]
  );
};

export const addLocation = (address: string, coordinates: [string, string]) => {
  locationMap.set(
    address.trim().replace(/\s+/g, ' ').toLowerCase(),
    coordinates
  );
};
