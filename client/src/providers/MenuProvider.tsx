import { atom, useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScreenType, useScreen } from './ScreenProvider';

const menuAtom = atom(false);

export const useMenu = () => useAtom(menuAtom);
export const useGetMenu = () => useAtomValue(menuAtom);

export const MenuProvider: React.FC = () => {
  const [isSideMenuOpen, setIsSideMenuOpen] = useMenu();
  const screen = useScreen();
  const { pathname } = useLocation();

  useEffect(() => {
    setIsSideMenuOpen(false);
  }, [pathname, setIsSideMenuOpen]);

  useEffect(() => {
    if (isSideMenuOpen) {
      document.body.classList.add('scroll-lock');
    } else {
      document.body.classList.remove('scroll-lock');
    }
  }, [isSideMenuOpen]);

  // useEffect(() => {
  //   if (screen === ScreenType.DESKTOP) {
  //     setIsSideMenuOpen(false);
  //   }
  // }, [screen, setIsSideMenuOpen]);

  return null;
};
