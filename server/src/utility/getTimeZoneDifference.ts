import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

export function getTimeZoneDifference(timezone: string) {
  const date = new Date();
  const otherDate = utcToZonedTime(zonedTimeToUtc(date, 'UTC'), timezone);

  return (otherDate.getTime() - date.getTime()) / (60 * 1000);
}
