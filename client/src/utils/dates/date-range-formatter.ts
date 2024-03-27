import { format, getDate, getMonth, getYear } from 'date-fns';
import { DATE_FORMAT_TEXT } from '../../data/constants';

export const dateRangeFormatter = (start: Date, end: Date): string => {
  if (getYear(start) !== getYear(end)) {
    return `${format(start, DATE_FORMAT_TEXT)} - ${format(
      end,
      DATE_FORMAT_TEXT,
    )}`;
  } else if (getMonth(start) !== getMonth(end)) {
    return `${format(start, 'd, MMM')} - ${format(end, 'd, MMM')} ${getYear(
      start,
    )}`;
  }
  return `${getDate(start)}-${getDate(end)}, ${format(start, 'MMM y')}`
};
