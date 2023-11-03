import { useEffect, useRef, useState } from 'react';

export const useObserver = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [observe, startObserving] = useState<boolean>(true);

  useEffect(() => {
    const ref = containerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        // console.log('in callback')
        // console.log(entries)
        const [entry] = entries;
        setIsVisible(entry.isIntersecting && observe);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0,
      },
    );

    if (ref) {
      observer.observe(ref);
    }

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
  }, [observe]);

  return { containerRef, isVisible, startObserving };
};
