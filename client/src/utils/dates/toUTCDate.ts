import { isMatch } from 'date-fns';
import { DATE_FORMAT_NUM } from '../../data/constants';

export const toUTCDate = (val: string | Date): Date => {
  var date = new Date(val);
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
    date.getUTCMilliseconds()
  );
};

export const safeToUTCDate = (val: string | undefined | null) => {
  
  if (val && isMatch(val, DATE_FORMAT_NUM)) {
    return toUTCDate(val);
  }

  return undefined;
};
