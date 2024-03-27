import { format, zonedTimeToUtc } from 'date-fns-tz';

export const DATE_FORMAT_NUM = 'yyyy-MM-dd';
export const DATE_FORMAT_TEXT = 'd, LLL y';

export function convertToUTCString(
  date: Date,
  timeZone: string,
): string | Date {
  const formattedDate = format(
    zonedTimeToUtc(date, timeZone),
    'yyyy-MM-dd HH:mm:ss.SSSXXX',
    {
      timeZone: 'UTC',
    },
  );
  return formattedDate;
}

export function convertToTimestampWithTimeZone(
  date: Date,
  timeZone: string,
): string {
  // Format the date in the desired format with timezone information
  const formattedDate = format(
    // zonedTimeToUtc(date, timeZone),
    date,
    'yyyy-MM-dd HH:mm:ss.SSSXXX',
    {
      timeZone,
    },
  );
  return formattedDate;
}
