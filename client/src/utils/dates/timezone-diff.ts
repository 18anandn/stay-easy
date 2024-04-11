import { TimeZoneDetails } from '../../types/TimeZoneDetails';

export function getTimeZoneDiff(
  offset: number,
  time_zone: string
): TimeZoneDetails {
  const localDate: Date = new Date();
  const client_tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const diff = -localDate.getTimezoneOffset() - offset;

  return {
    local: client_tz,
    other: time_zone,
    diff,
    formatted: formatMinutesToHHMM(Math.abs(diff)),
  };
}

function formatMinutesToHHMM(diff: number): string {
  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
  return `${formattedHours}:${formattedMinutes}`;
}
