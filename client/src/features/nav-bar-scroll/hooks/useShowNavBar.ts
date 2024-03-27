import { useState, useRef, useEffect } from 'react';

const SCROLL_AFTER = 100;

export const useShowNavBar = () => {
  const [isNavBarOpen, setIsNavBarOpen] = useState(true);
  const parentRef = useRef<HTMLDivElement>(null);

  // false indicates scroll down
  const scrollDirRef = useRef(false);
  const scrollPointRef = useRef(window.scrollY);
  const prevScrollRef = useRef(window.scrollY);
  const isIntersectingRef = useRef(true);

  useEffect(() => {
    const parent = parentRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) setIsNavBarOpen(true);
        isIntersectingRef.current = entry.isIntersecting;
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

    const watchScroll = () => {
      const currentScrollDir = window.scrollY < prevScrollRef.current;
      prevScrollRef.current = window.scrollY;
      if (currentScrollDir === scrollDirRef.current) {
        if (
          Math.abs(window.scrollY - scrollPointRef.current) > SCROLL_AFTER &&
          !isIntersectingRef.current
        ) {
          setIsNavBarOpen(currentScrollDir);
        }
      } else {
        scrollDirRef.current = currentScrollDir;
        scrollPointRef.current = window.scrollY;
      }
    };

    window.addEventListener('scroll', watchScroll);

    return () => {
      if (parent) {
        observer.unobserve(parent);
      }
      window.removeEventListener('scroll', watchScroll);
    };
  }, []);

  return { parentRef, isNavBarOpen };
};
