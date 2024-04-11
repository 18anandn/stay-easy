import { atom, useAtomValue, useSetAtom } from 'jotai';
import { ScreenType, useScreen } from '../providers/ScreenProvider';
import { useEffect } from 'react';
import { useSetHoveredHome } from '../pages/MapSearch/hooks/useHoveredHome';

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
  const setHoveredHome = useSetHoveredHome();
  const screen = useScreen();

  useEffect(() => {
    switch (screen) {
      case ScreenType.TAB:
        setHoveredHome('');
        break;
      case ScreenType.PHONE:
        setPopupDimensions({
          ...popupDimensions.desktop,
          mapHorizontalPadding: 10000,
          mapVerticalPadding: 10000,
        });
        break;
      default:
        setPopupDimensions(popupDimensions.desktop);
    }
  }, [screen, setPopupDimensions, setHoveredHome]);
  return null;
};
