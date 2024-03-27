import { addDays, compareAsc } from 'date-fns';

export function getInvalidCheckiInDates(
  bookings: [Date, Date][][],
  number_of_cabins: number,
) {
  const date_counter = new Map<string, number>();
  for (const cabin of bookings) {
    for (const booking of cabin) {
      let start_day = booking[0];
      while (compareAsc(start_day, booking[1]) < 0) {
        date_counter.set(
          start_day.toISOString(),
          (date_counter.get(start_day.toISOString()) ?? 0) + 1,
        );
        start_day = addDays(start_day, 1);
      }
    }
  }

  const invalidDates: Date[] = [];

  for (const key of date_counter.keys()) {
    if (date_counter.get(key) === number_of_cabins) {
      invalidDates.push(new Date(key));
    }
  }
  return invalidDates;
}
