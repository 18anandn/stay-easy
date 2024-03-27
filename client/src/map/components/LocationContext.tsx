import { ReactNode, createContext, useRef, useState } from 'react';

type Rect = {
  height: number;
  width: number;
  padding: number;
  mapVerticalPadding: number;
  mapHorizontalPadding: number;
};

type ContextType = {
  getLocation: (address: string) => [string, string];
  addLocation: (address: string, coordinates: [string, string]) => void;
  popupDimensions?: Rect;
  setPopupDimensions?: (dims: Rect) => void;
};

export const LocationContext = createContext<ContextType>({
  getLocation: (address: string) => {
    throw new Error(address);
  },
  addLocation: (address: string, coordinates: [string, string]) => {
    throw new Error(`${address}: ${coordinates}`);
  },
});

type Props = {
  children?: ReactNode;
};

export const LocationContextProvider: React.FC<Props> = ({ children }) => {
  const locationMappingRef = useRef(new Map<string, [string, string]>());
  const [popupDimensions, setPopupDimensions] = useState<Rect>({
    height: 250,
    width: 250,
    padding: 15,
    mapHorizontalPadding: 15,
    mapVerticalPadding: 15,
  });

  const getLocation = (address: string): [string, string] => {
    return (
      locationMappingRef.current.get(
        address.trim().replace(/\s+/g, ' ').toLowerCase(),
      ) ?? ['', '']
    );
  };

  const addLocation = (address: string, coordinates: [string, string]) => {
    locationMappingRef.current.set(
      address.trim().replace(/\s+/g, ' ').toLowerCase(),
      coordinates,
    );
  };

  return (
    <LocationContext.Provider
      value={{
        getLocation,
        addLocation,
        setPopupDimensions,
        popupDimensions,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};
