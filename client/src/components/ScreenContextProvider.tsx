import { ReactNode, createContext, useEffect, useState } from 'react';

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

type ContextType = {
  screen: ScreenType;
};

let defaultScreen = ScreenType.DESKTOP;
if (window.innerWidth <= screenWidths.phone) {
  defaultScreen = ScreenType.PHONE;
} else if (window.innerWidth <= screenWidths.tab) {
  defaultScreen = ScreenType.TAB;
}

export const ScreenContext = createContext<ContextType>({
  screen: defaultScreen,
});

type Props = {
  children?: ReactNode;
};

const ScreenContextProvider: React.FC<Props> = ({ children }) => {
  const [screen, setScreen] = useState<ScreenType>(() => defaultScreen);

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
  }, []);

  return (
    <ScreenContext.Provider value={{ screen }}>
      {children}
    </ScreenContext.Provider>
  );
};

export default ScreenContextProvider;
