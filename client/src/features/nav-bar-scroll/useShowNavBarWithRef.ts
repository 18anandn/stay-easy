import { useEffect, useRef } from 'react';
import { useNavBar } from './useNavBar';

const SCROLL_AFTER = 100;

export const useShowNavBarWithRef = () => {
  const [isNavBarOpen, setIsNavBarOpen] = useNavBar();
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parent = parentRef.current;
    let isInterSecting = true;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) setIsNavBarOpen(true);
        isInterSecting = entry.isIntersecting;
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0,
      }
    );
    if (parent) {
      observer.observe(parent);
    }

    //false indicates scroll down
    let scrollDir = false;
    let scrollPoint = window.scrollY;
    let prevScroll = window.scrollY;

    const watchScroll = () => {
      const currentScrollDir = window.scrollY < prevScroll;
      prevScroll = window.scrollY;
      if (currentScrollDir === scrollDir) {
        if (
          Math.abs(window.scrollY - scrollPoint) > SCROLL_AFTER &&
          !isInterSecting
        ) {
          setIsNavBarOpen(currentScrollDir);
        }
      } else {
        scrollDir = currentScrollDir;
        scrollPoint = window.scrollY;
      }
    };

    window.addEventListener('scroll', watchScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', watchScroll);
    };
  }, [setIsNavBarOpen]);

  return { parentRef, isNavBarOpen };
};
