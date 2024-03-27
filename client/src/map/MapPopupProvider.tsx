import { atom, useAtomValue, useSetAtom } from 'jotai';
import { ScreenType, useScreen } from '../providers/ScreenProvider';
import { useEffect } from 'react';

type Rect = {
  height: number;
  width: number;
  padding: number;
  mapVerticalPadding: number;
  mapHorizontalPadding: number;
};

const popupDimensions = {
  desktop: {
    height: 250,
    width: 250,
    padding: 15,
    mapHorizontalPadding: 15,
    mapVerticalPadding: 15,
  },
};

const popupDimensionsAtom = atom<Rect>(popupDimensions.desktop);

export const usePopupDimensions = () => useAtomValue(popupDimensionsAtom);

export const MapPopupProvider: React.FC = () => {
  const setPopupDimensions = useSetAtom(popupDimensionsAtom);
  const screen = useScreen();

  useEffect(() => {
    switch (screen) {
      case ScreenType.TAB:
        break;
      case ScreenType.PHONE:
        break;
      default:
        setPopupDimensions(popupDimensions.desktop);
    }
  }, [screen, setPopupDimensions]);
  return null;
};
