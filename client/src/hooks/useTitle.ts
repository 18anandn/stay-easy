import { useLayoutEffect } from 'react';
import { setTitle } from '../utils/setTitle';
import { resetTitle } from '../utils/resetTitle';

export const useTitle = (str: string | undefined | null) =>
  useLayoutEffect(() => {
    if (str) {
      setTitle(str);
    }
    return () => resetTitle();
  }, [str]);
