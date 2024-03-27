import { atom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

export enum ScreenType {
  DESKTOP = 'desktop',
  TAB = 'tab',
  PHONE = 'phone',
}

export const screenWidths = {
  desktop: 1440,
  tab: 1024,
  phone: 600,
};

let defaultScreen = ScreenType.DESKTOP;
if (window.innerWidth <= screenWidths.phone) {
  defaultScreen = ScreenType.PHONE;
} else if (window.innerWidth <= screenWidths.tab) {
  defaultScreen = ScreenType.TAB;
}

const screenAtom = atom(defaultScreen);

export const ScreenProvider: React.FC = () => {
  const setScreen = useSetAtom(screenAtom);

  useEffect(() => {
    function screenTypeCheck() {
      const widthStamp = window.screen.width;
      if (widthStamp <= screenWidths.phone) {
        setScreen(ScreenType.PHONE);
      } else if (widthStamp <= screenWidths.tab) {
        setScreen(ScreenType.TAB);
      } else {
        setScreen(ScreenType.DESKTOP);
      }
    }

    screenTypeCheck();

    window.addEventListener('resize', screenTypeCheck);
    return () => {
      window.removeEventListener('resize', screenTypeCheck);
    };
  }, [setScreen]);

  return null;
};

export const useScreen = () => useAtomValue(screenAtom);
